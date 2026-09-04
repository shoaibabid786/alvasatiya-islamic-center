import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import {
  addFeedback,
  adminCreateTeacher,
  adminUpdateUser,
  assignTeacher,
  createAdminCourse,
  gradeSubmission,
  issueCertificate,
  recordAttendance,
  saveAnnouncement,
  saveAssignment,
  saveClass,
  saveQuiz,
  snapshotFor,
  submitAssignment,
  submitQuiz,
  updateDemo,
  upsertCourseOverride,
  saveInstitutionOverride,
} from "@/lib/lms";

export async function GET() {
  const { user, error } = await requireUser();
  if (!user) return NextResponse.json({ error }, { status: 401 });
  return NextResponse.json(snapshotFor(user));
}

export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (!user) return NextResponse.json({ error }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "");
  try {
    if (user.role === "ADMIN") {
      if (action === "updateDemo") return NextResponse.json(updateDemo(body.id, { status: body.status, scheduledAt: body.scheduledAt }));
      if (action === "updateUser") return NextResponse.json(adminUpdateUser(body.id, { status: body.status, role: body.role, name: body.name }));
      if (action === "createTeacher") return NextResponse.json(adminCreateTeacher(body));
      if (action === "assignTeacher") return NextResponse.json(assignTeacher(body.enrollmentId, body.teacherId));
      if (action === "saveCourse") return NextResponse.json(upsertCourseOverride(body.course));
      if (action === "createCourse") return NextResponse.json(createAdminCourse(body));
      if (action === "issueCertificate") return NextResponse.json(issueCertificate(body.studentId, body.courseSlug));
      if (action === "saveAnnouncement") return NextResponse.json(saveAnnouncement(body));
      if (action === "saveInstitution") return NextResponse.json(saveInstitutionOverride(body.institution));
    }
    if (user.role === "ADMIN") {
      if (action === "saveClass") return NextResponse.json(saveClass(user, body));
    }
    if (user.role === "ADMIN" || user.role === "TEACHER") {
      if (action === "saveAssignment") return NextResponse.json(saveAssignment(user, body));
      if (action === "gradeSubmission") return NextResponse.json(gradeSubmission(user, body.submissionId, body.grade, body.feedback));
      if (action === "saveQuiz") return NextResponse.json(saveQuiz(user, body));
      if (action === "recordAttendance") return NextResponse.json(recordAttendance(user, body.classId, body.studentId, Boolean(body.present)));
    }
    if (action === "submitAssignment") return NextResponse.json(submitAssignment(user.id, body.assignmentId, String(body.content || "")));
    if (action === "submitQuiz") return NextResponse.json(submitQuiz(user.id, body.quizId, Array.isArray(body.answers) ? body.answers : []));
    if (action === "addFeedback") return NextResponse.json(addFeedback(user.id, String(body.message || ""), body.courseSlug));
    return NextResponse.json({ error: "Unknown or unauthorized action." }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Request failed." }, { status: 400 });
  }
}
