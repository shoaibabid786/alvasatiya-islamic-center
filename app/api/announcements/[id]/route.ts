import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { deleteAnnouncement, saveAnnouncement } from "@/lib/lms/announcements";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const { id } = await context.params;
    const body = await request.json();
    return jsonOk(await saveAnnouncement(user, body, id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const { id } = await context.params;
    return jsonOk(await deleteAnnouncement(user, id));
  } catch (error) {
    return jsonError(error);
  }
}
