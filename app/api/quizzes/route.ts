import { jsonError, jsonOk, parseSearch, requireApiUser } from "@/lib/lms/http";
import { listQuizzes, saveQuiz } from "@/lib/lms/quizzes";

export async function GET(request: Request) {
  try {
    const user = await requireApiUser();
    const { q, classId, status } = parseSearch(request.url);
    return jsonOk({ quizzes: await listQuizzes(user, q, classId, status) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const body = await request.json();
    return jsonOk(await saveQuiz(user, body), 201);
  } catch (error) {
    return jsonError(error);
  }
}
