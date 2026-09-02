import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { joinClass } from "@/lib/lms/classes";

export async function POST(request: Request) {
  try {
    const user = await requireApiUser(["STUDENT"]);
    const body = await request.json();
    return jsonOk(await joinClass(user, body));
  } catch (error) {
    return jsonError(error);
  }
}
