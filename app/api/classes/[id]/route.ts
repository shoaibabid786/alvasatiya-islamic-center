import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { addClassStudents, deleteClass, getClass, removeClassStudent, updateClass } from "@/lib/lms/classes";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const { id } = await context.params;
    return jsonOk(await getClass(user, id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireApiUser(["ADMIN"]);
    const { id } = await context.params;
    const body = await request.json();
    return jsonOk(await updateClass(id, body));
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireApiUser(["ADMIN"]);
    const { id } = await context.params;
    return jsonOk(await deleteClass(id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireApiUser(["ADMIN"]);
    const { id } = await context.params;
    const body = await request.json();
    if (body.removeStudentId) return jsonOk(await removeClassStudent(id, String(body.removeStudentId)));
    return jsonOk(await addClassStudents(id, Array.isArray(body.studentIds) ? body.studentIds : [String(body.studentId)]));
  } catch (error) {
    return jsonError(error);
  }
}
