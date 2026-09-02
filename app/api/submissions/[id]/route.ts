import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { gradeSubmission } from "@/lib/lms/assignments";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const { id } = await context.params;
    const body = await request.json();
    return jsonOk(await gradeSubmission(user, id, body));
  } catch (error) {
    return jsonError(error);
  }
}
