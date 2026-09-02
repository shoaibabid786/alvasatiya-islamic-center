import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { deleteUser, teacherDetail, updateTeacher } from "@/lib/lms/users";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireApiUser(["ADMIN"]);
    const { id } = await context.params;
    return jsonOk(await teacherDetail(id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireApiUser(["ADMIN"]);
    const { id } = await context.params;
    const body = await request.json();
    const teacher = await updateTeacher(id, body);
    return jsonOk({ teacher, message: "Teacher updated successfully" });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireApiUser(["ADMIN"]);
    const { id } = await context.params;
    return jsonOk(await deleteUser(id, "TEACHER"));
  } catch (error) {
    return jsonError(error);
  }
}
