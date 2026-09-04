import { prisma } from "@/lib/prisma";
import { toPublicUser, type PublicUser } from "@/lib/auth";
import { quizAttemptSchema, quizSchema } from "@/lib/lms/schemas";
import { HttpError } from "@/lib/lms/types";
import { assertClassAccess, studentClassIds, teacherClassIds } from "@/lib/lms/http";

function sumMarks(questions: { marks: number }[]) {
  return questions.reduce((sum, question) => sum + question.marks, 0);
}

function stripQuestion<T extends { correctAnswer: string }>(question: T) {
  const { correctAnswer: _hidden, ...rest } = question;
  return rest;
}

export async function listQuizzes(user: PublicUser, q = "", classId = "", status = "") {
  const classIds =
    user.role === "STUDENT" ? await studentClassIds(user.id) : user.role === "TEACHER" ? await teacherClassIds(user) : undefined;
  const where = {
    ...(classIds ? { classId: { in: classIds } } : {}),
    ...(classId ? { classId } : {}),
    ...(status ? { status } : {}),
    ...(user.role === "STUDENT" ? { status: "PUBLISHED" } : {}),
    ...(q ? { OR: [{ title: { contains: q } }, { class: { name: { contains: q } } }] } : {}),
  };
  const rows = await prisma.quiz.findMany({
    where,
    include: {
      class: true,
      _count: { select: { questions: true, attempts: true } },
      attempts: user.role === "STUDENT" ? { where: { studentId: user.id } } : false,
    },
    orderBy: { createdAt: "desc" },
  });
  return rows;
}

export async function getQuiz(user: PublicUser, id: string, forAttempt = false) {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { class: true, questions: { orderBy: { sortOrder: "asc" } }, attempts: { include: { student: true, answers: true } } },
  });
  if (!quiz) throw new HttpError(404, "Quiz not found.");
  await assertClassAccess(user, quiz.classId, user.role === "STUDENT" ? "view" : "manage");
  if (user.role === "STUDENT") {
    if (quiz.status !== "PUBLISHED") throw new HttpError(403, "This quiz is not available.");
    const attempt = quiz.attempts.find((item) => item.studentId === user.id);
    return {
      ...quiz,
      questions: quiz.questions.map((question) => (forAttempt && attempt?.status !== "SUBMITTED" ? stripQuestion(question) : forAttempt ? question : stripQuestion(question))),
      attempt: attempt || null,
      attempts: undefined,
    };
  }
  return {
    ...quiz,
    attempts: quiz.attempts.map((attempt) => ({ ...attempt, student: toPublicUser(attempt.student) })),
  };
}

export async function saveQuiz(user: PublicUser, body: unknown, id?: string) {
  const data = quizSchema.parse(body);
  await assertClassAccess(user, data.classId, "manage");
  const questions = data.questions || [];
  const totalMarks = sumMarks(questions);
  if (id) {
    const current = await prisma.quiz.findUnique({ where: { id } });
    if (!current) throw new HttpError(404, "Quiz not found.");
    if (user.role === "TEACHER") {
      const classRow = await prisma.class.findUnique({ where: { id: current.classId } });
      if (current.teacherId !== user.id && classRow?.teacherId !== user.id) throw new HttpError(403, "Unauthorized access");
    }
    const updated = await prisma.quiz.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || "",
        classId: data.classId,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        timeLimitMin: data.timeLimitMin,
        passingMarks: data.passingMarks,
        totalMarks,
        status: data.status || current.status,
      },
    });
    if (data.questions) {
      await prisma.question.deleteMany({ where: { quizId: id } });
      if (data.questions.length) {
        await prisma.question.createMany({
          data: data.questions.map((question, index) => ({
            quizId: id,
            prompt: question.prompt,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            correctAnswer: question.correctAnswer,
            marks: question.marks,
            sortOrder: index,
          })),
        });
      }
    }
    return { ...updated, message: "Quiz updated successfully" };
  }
  const created = await prisma.quiz.create({
    data: {
      title: data.title,
      description: data.description || "",
      classId: data.classId,
      teacherId: user.role === "ADMIN" ? (await prisma.class.findUnique({ where: { id: data.classId } }))?.teacherId || user.id : user.id,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      timeLimitMin: data.timeLimitMin,
      passingMarks: data.passingMarks,
      totalMarks,
      status: data.status || "DRAFT",
      questions: {
        create: questions.map((question, index) => ({
          prompt: question.prompt,
          optionA: question.optionA,
          optionB: question.optionB,
          optionC: question.optionC,
          optionD: question.optionD,
          correctAnswer: question.correctAnswer,
          marks: question.marks,
          sortOrder: index,
        })),
      },
    },
  });
  return { ...created, message: "Quiz created successfully" };
}

export async function setQuizStatus(user: PublicUser, id: string, status: string) {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) throw new HttpError(404, "Quiz not found.");
  await assertClassAccess(user, quiz.classId, "manage");
  const updated = await prisma.quiz.update({ where: { id }, data: { status } });
  return { ...updated, message: status === "PUBLISHED" ? "Quiz published successfully" : "Quiz updated successfully" };
}

export async function deleteQuiz(user: PublicUser, id: string) {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) throw new HttpError(404, "Quiz not found.");
  await assertClassAccess(user, quiz.classId, "manage");
  await prisma.quiz.delete({ where: { id } });
  return { ok: true, message: "Quiz deleted successfully" };
}

export async function startOrGetAttempt(user: PublicUser, quizId: string) {
  if (user.role !== "STUDENT") throw new HttpError(403, "Unauthorized access");
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { sortOrder: "asc" } } },
  });
  if (!quiz) throw new HttpError(404, "Quiz not found.");
  await assertClassAccess(user, quiz.classId, "view");
  if (quiz.status !== "PUBLISHED") throw new HttpError(403, "This quiz is not available.");
  const now = new Date();
  if (quiz.startDate && now < quiz.startDate) throw new HttpError(400, "This quiz has not started yet.");
  if (quiz.endDate && now > quiz.endDate) throw new HttpError(400, "This quiz has ended.");
  const existing = await prisma.quizAttempt.findUnique({
    where: { quizId_studentId: { quizId, studentId: user.id } },
    include: { answers: true },
  });
  if (existing?.status === "SUBMITTED") throw new HttpError(400, "Quiz already submitted");
  const attempt =
    existing ||
    (await prisma.quizAttempt.create({
      data: { quizId, studentId: user.id, status: "IN_PROGRESS" },
      include: { answers: true },
    }));
  return {
    attempt,
    quiz: {
      id: quiz.id,
      title: quiz.title,
      timeLimitMin: quiz.timeLimitMin,
      totalMarks: quiz.totalMarks,
      passingMarks: quiz.passingMarks,
      questions: quiz.questions.map(stripQuestion),
    },
  };
}

export async function submitAttempt(user: PublicUser, quizId: string, body: unknown) {
  if (user.role !== "STUDENT") throw new HttpError(403, "Unauthorized access");
  const data = quizAttemptSchema.parse(body);
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });
  if (!quiz) throw new HttpError(404, "Quiz not found.");
  await assertClassAccess(user, quiz.classId, "view");
  const existing = await prisma.quizAttempt.findUnique({
    where: { quizId_studentId: { quizId, studentId: user.id } },
  });
  if (existing?.status === "SUBMITTED") throw new HttpError(400, "Quiz already submitted");
  const answerMap = new Map(data.answers.map((item) => [item.questionId, item.selected]));
  let score = 0;
  let correct = 0;
  for (const question of quiz.questions) {
    const selected = answerMap.get(question.id);
    if (selected === question.correctAnswer) {
      score += question.marks;
      correct += 1;
    }
  }
  const attempt = await prisma.$transaction(async (tx) => {
    const row =
      existing ||
      (await tx.quizAttempt.create({
        data: { quizId, studentId: user.id },
      }));
    await tx.quizAnswer.deleteMany({ where: { attemptId: row.id } });
    if (data.answers.length) {
      await tx.quizAnswer.createMany({
        data: data.answers.map((item) => ({
          attemptId: row.id,
          questionId: item.questionId,
          selected: item.selected,
        })),
      });
    }
    return tx.quizAttempt.update({
      where: { id: row.id },
      data: { status: "SUBMITTED", submittedAt: new Date(), score },
    });
  });
  const total = quiz.totalMarks || sumMarks(quiz.questions);
  const wrong = quiz.questions.length - correct;
  const percentage = total ? Math.round((score / total) * 1000) / 10 : 0;
  return {
    attempt,
    score,
    totalMarks: total,
    percentage,
    correct,
    wrong,
    passed: score >= quiz.passingMarks,
    message: "Quiz submitted successfully",
  };
}
