import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { deleteUser } from "@/lib/lms/users";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireApiUser(["ADMIN"]);
    const { id } = await context.params;
    return jsonOk(await deleteUser(id, "ADMIN"));
  } catch (error) {
    return jsonError(error);
  }
}
