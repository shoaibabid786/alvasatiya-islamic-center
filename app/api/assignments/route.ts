import { jsonError, jsonOk, parseSearch, requireApiUser } from "@/lib/lms/http";
import { listAssignments, saveAssignment } from "@/lib/lms/assignments";

export async function GET(request: Request) {
  try {
    const user = await requireApiUser();
    const { q, classId, status } = parseSearch(request.url);
    return jsonOk({ assignments: await listAssignments(user, q, classId, status) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const body = await request.json();
    return jsonOk(await saveAssignment(user, body), 201);
  } catch (error) {
    return jsonError(error);
  }
}
