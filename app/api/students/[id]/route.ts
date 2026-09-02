import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { deleteUser, studentDetail, updateStudent } from "@/lib/lms/users";
import { HttpError } from "@/lib/lms/types";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const { id } = await context.params;
    const detail = await studentDetail(id);
    if (user.role === "TEACHER") {
      const { prisma } = await import("@/lib/prisma");
      const allowed = await prisma.classMember.findFirst({
        where: { studentId: id, class: { teacherId: user.id } },
      });
      if (!allowed) throw new HttpError(403, "Unauthorized access");
    }
    return jsonOk(detail);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireApiUser(["ADMIN"]);
    const { id } = await context.params;
    const body = await request.json();
    const student = await updateStudent(id, body);
    return jsonOk({ student, message: "Student updated successfully" });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireApiUser(["ADMIN"]);
    const { id } = await context.params;
    return jsonOk(await deleteUser(id, "STUDENT"));
  } catch (error) {
    return jsonError(error);
  }
}
