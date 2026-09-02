import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { deleteQuiz, getQuiz, saveQuiz, setQuizStatus } from "@/lib/lms/quizzes";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const { id } = await context.params;
    const forAttempt = new URL(request.url).searchParams.get("attempt") === "1";
    return jsonOk(await getQuiz(user, id, forAttempt));
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const { id } = await context.params;
    const body = await request.json();
    if (body.status && Object.keys(body).length === 1) return jsonOk(await setQuizStatus(user, id, body.status));
    return jsonOk(await saveQuiz(user, body, id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const { id } = await context.params;
    return jsonOk(await deleteQuiz(user, id));
  } catch (error) {
    return jsonError(error);
  }
}
