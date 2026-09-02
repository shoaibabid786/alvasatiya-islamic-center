import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { startOrGetAttempt, submitAttempt } from "@/lib/lms/quizzes";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["STUDENT"]);
    const { id } = await context.params;
    return jsonOk(await startOrGetAttempt(user, id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["STUDENT"]);
    const { id } = await context.params;
    const body = await request.json();
    return jsonOk(await submitAttempt(user, id, body));
  } catch (error) {
    return jsonError(error);
  }
}
