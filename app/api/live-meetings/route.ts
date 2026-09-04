import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { listLiveMeetings, saveLiveMeeting } from "@/lib/lms/live-meetings";

export async function GET() {
  try {
    const user = await requireApiUser();
    return jsonOk({ meetings: await listLiveMeetings(user) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser(["ADMIN"]);
    const body = await request.json();
    return jsonOk(await saveLiveMeeting(user, body), 201);
  } catch (error) {
    return jsonError(error);
  }
}
