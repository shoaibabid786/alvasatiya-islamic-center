import { jsonError, jsonOk, parseSearch, requireApiUser } from "@/lib/lms/http";
import { createTeacher, listUsers } from "@/lib/lms/users";

export async function GET(request: Request) {
  try {
    await requireApiUser(["ADMIN"]);
    const { q, page, pageSize, status } = parseSearch(request.url);
    return jsonOk(await listUsers("TEACHER", q, status, page, pageSize));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireApiUser(["ADMIN"]);
    const body = await request.json();
    const teacher = await createTeacher(body);
    return jsonOk({ teacher, message: "Teacher created successfully" }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
