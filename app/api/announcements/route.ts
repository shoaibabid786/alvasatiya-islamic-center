import { jsonError, jsonOk, parseSearch, requireApiUser } from "@/lib/lms/http";
import { listAnnouncements, saveAnnouncement } from "@/lib/lms/announcements";

export async function GET(request: Request) {
  try {
    const user = await requireApiUser();
    const { classId } = parseSearch(request.url);
    return jsonOk({ announcements: await listAnnouncements(user, classId) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const body = await request.json();
    return jsonOk(await saveAnnouncement(user, body), 201);
  } catch (error) {
    return jsonError(error);
  }
}
