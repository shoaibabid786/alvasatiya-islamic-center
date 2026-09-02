import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { deleteAssignment, getAssignment, saveAssignment } from "@/lib/lms/assignments";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const { id } = await context.params;
    return jsonOk(await getAssignment(user, id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const { id } = await context.params;
    const body = await request.json();
    return jsonOk(await saveAssignment(user, body, id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const { id } = await context.params;
    return jsonOk(await deleteAssignment(user, id));
  } catch (error) {
    return jsonError(error);
  }
}
