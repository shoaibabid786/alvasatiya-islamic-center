import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { reportsFor } from "@/lib/lms/dashboard";

export async function GET() {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    return jsonOk(await reportsFor(user));
  } catch (error) {
    return jsonError(error);
  }
}
