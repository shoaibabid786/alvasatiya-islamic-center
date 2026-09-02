import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysAgo(n: number) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  date.setHours(9, 0, 0, 0);
  return date;
}

function ymd(n: number) {
  return daysAgo(n).toISOString().slice(0, 10);
}

async function main() {
  await prisma.quizAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.classMember.deleteMany();
  await prisma.session.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  const password = (value: string) => bcrypt.hashSync(value, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Alvasatiya Admin",
      email: "admin@example.com",
      passwordHash: password("Admin@2026!"),
      phone: "+92 300 4840308",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  await prisma.user.create({
    data: {
      name: "Alvasatiya Office Admin",
      email: "admin@alvasatiya.org",
      passwordHash: password("AlvasatiyaAdmin!2026"),
      phone: "+92 300 4840308",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const teacher = await prisma.user.create({
    data: {
      name: "Ustadha Amina Rahman",
      email: "teacher@example.com",
      passwordHash: password("Teacher@2026!"),
      phone: "+92 301 1112233",
      role: "TEACHER",
      status: "ACTIVE",
      qualification: "MA Islamic Studies, Ijazah in Tajweed",
      experience: "8 years teaching Quran and Arabic",
    },
  });

  const teacherTwo = await prisma.user.create({
    data: {
      name: "Ustadh Yusuf Malik",
      email: "teacher@alvasatiya.org",
      passwordHash: password("AlvasatiyaTeacher!2026"),
      phone: "+92 302 2223344",
      role: "TEACHER",
      status: "ACTIVE",
      qualification: "Alimiyyah, BA Arabic",
      experience: "5 years",
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "Fatima Noor",
      email: "student@example.com",
      passwordHash: password("Student@2026!"),
      phone: "+92 333 5556677",
      role: "STUDENT",
      status: "ACTIVE",
      studentCode: "STU-100001",
      dateOfBirth: "2008-04-12",
    },
  });

  const moreStudents = await Promise.all(
    [
      ["Omar Siddiqui", "omar@example.com", "STU-100002"],
      ["Aisha Karim", "aisha@example.com", "STU-100003"],
      ["Zayd Hassan", "zayd@example.com", "STU-100004"],
    ].map(([name, email, studentCode]) =>
      prisma.user.create({
        data: {
          name,
          email,
          passwordHash: password("Student@2026!"),
          role: "STUDENT",
          status: "ACTIVE",
          studentCode,
        },
      }),
    ),
  );

  const quranClass = await prisma.class.create({
    data: {
      name: "Quran Recitation — Level 1",
      description: "Foundational tajweed, makharij, and daily recitation practice.",
      subject: "Quran",
      teacherId: teacher.id,
      startDate: daysAgo(40),
      endDate: daysAgo(-80),
      code: "QRN101",
      status: "ACTIVE",
    },
  });

  const fiqhClass = await prisma.class.create({
    data: {
      name: "Fiqh Essentials",
      description: "Worship, purification, and everyday rulings for students.",
      subject: "Fiqh",
      teacherId: teacherTwo.id,
      startDate: daysAgo(20),
      endDate: daysAgo(-100),
      code: "FQH201",
      status: "ACTIVE",
    },
  });

  const allStudents = [student, ...moreStudents];
  await prisma.classMember.createMany({
    data: [
      ...allStudents.map((item) => ({ classId: quranClass.id, studentId: item.id })),
      { classId: fiqhClass.id, studentId: student.id },
      { classId: fiqhClass.id, studentId: moreStudents[0].id },
    ],
  });

  const quiz = await prisma.quiz.create({
    data: {
      title: "Tajweed Basics",
      description: "Short multiple-choice check on articulation points and rules.",
      classId: quranClass.id,
      teacherId: teacher.id,
      startDate: daysAgo(3),
      endDate: daysAgo(-14),
      timeLimitMin: 15,
      passingMarks: 6,
      totalMarks: 10,
      status: "PUBLISHED",
      questions: {
        create: [
          {
            prompt: "What does tajweed literally mean?",
            optionA: "To memorize",
            optionB: "To make better / beautify",
            optionC: "To translate",
            optionD: "To write",
            correctAnswer: "B",
            marks: 2,
            sortOrder: 0,
          },
          {
            prompt: "Noon sakinah and tanween are involved in which rule family?",
            optionA: "Qalqalah only",
            optionB: "Idgham, Iqlab, Izhhar, Ikhfa",
            optionC: "Madd only",
            optionD: "Waqf only",
            correctAnswer: "B",
            marks: 4,
            sortOrder: 1,
          },
          {
            prompt: "Which letter is a qalqalah letter?",
            optionA: "ق",
            optionB: "س",
            optionC: "ل",
            optionD: "ن",
            correctAnswer: "A",
            marks: 4,
            sortOrder: 2,
          },
        ],
      },
    },
  });

  const questions = await prisma.question.findMany({ where: { quizId: quiz.id }, orderBy: { sortOrder: "asc" } });
  await prisma.quizAttempt.create({
    data: {
      quizId: quiz.id,
      studentId: moreStudents[0].id,
      status: "SUBMITTED",
      submittedAt: new Date(),
      score: 10,
      answers: {
        create: questions.map((question) => ({
          questionId: question.id,
          selected: question.correctAnswer,
        })),
      },
    },
  });

  const assignment = await prisma.assignment.create({
    data: {
      title: "Weekly Recitation Recording",
      description: "Record Surah Al-Fatihah with correct makharij and upload your file.",
      classId: quranClass.id,
      teacherId: teacher.id,
      dueDate: daysAgo(-7),
      totalMarks: 20,
      status: "PUBLISHED",
    },
  });

  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assignment.id,
      studentId: moreStudents[1].id,
      originalName: "fatihah-notes.pdf",
      mimeType: "application/pdf",
      fileSize: 12000,
      status: "SUBMITTED",
    },
  });

  const statuses = ["PRESENT", "PRESENT", "LATE", "PRESENT", "ABSENT", "LEAVE"] as const;
  const attendanceData = [];
  for (let day = 1; day <= 8; day++) {
    for (let i = 0; i < allStudents.length; i++) {
      attendanceData.push({
        classId: quranClass.id,
        studentId: allStudents[i].id,
        date: ymd(day),
        status: statuses[(i + day) % statuses.length],
      });
    }
  }
  await prisma.attendance.createMany({ data: attendanceData });

  await prisma.announcement.create({
    data: {
      title: "Welcome to Quran Recitation",
      message: "Please join class on time, keep your mushaf ready, and submit the weekly recording before Friday.",
      classId: quranClass.id,
      authorId: teacher.id,
      publishDate: new Date(),
    },
  });

  await prisma.setting.createMany({
    data: [
      { key: "organizationName", value: "Alvasatiya Islamic Center" },
      { key: "supportEmail", value: "alvasatiya4@gmail.com" },
    ],
  });

  console.log("Seed complete.");
  console.log("Admin:    admin@example.com / Admin@2026!");
  console.log("Teacher:  teacher@example.com / Teacher@2026!");
  console.log("Student:  student@example.com / Student@2026!");
  console.log("Class codes: QRN101, FQH201");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
