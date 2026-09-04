import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { deleteLiveMeeting, saveLiveMeeting } from "@/lib/lms/live-meetings";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["ADMIN"]);
    const { id } = await context.params;
    const body = await request.json();
    return jsonOk(await saveLiveMeeting(user, body, id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["ADMIN"]);
    const { id } = await context.params;
    return jsonOk(await deleteLiveMeeting(user, id));
  } catch (error) {
    return jsonError(error);
  }
}
