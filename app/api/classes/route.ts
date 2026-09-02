import { jsonError, jsonOk, parseSearch, requireApiUser } from "@/lib/lms/http";
import { createClass, listClasses, listStudentsForSelect, listTeachersForSelect } from "@/lib/lms/classes";

export async function GET(request: Request) {
  try {
    const user = await requireApiUser();
    const { q, page, pageSize, status } = parseSearch(request.url);
    const url = new URL(request.url);
    if (url.searchParams.get("select") === "teachers") return jsonOk({ teachers: await listTeachersForSelect() });
    if (url.searchParams.get("select") === "students") return jsonOk({ students: await listStudentsForSelect() });
    return jsonOk(await listClasses(user, q, status, page, pageSize));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireApiUser(["ADMIN"]);
    const body = await request.json();
    return jsonOk(await createClass(body), 201);
  } catch (error) {
    return jsonError(error);
  }
}
