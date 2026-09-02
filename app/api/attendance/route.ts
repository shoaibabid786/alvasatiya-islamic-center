import { jsonError, jsonOk, parseSearch, requireApiUser } from "@/lib/lms/http";
import { listAttendance, rosterForDate, saveAttendance, studentAttendanceSummary } from "@/lib/lms/attendance";

export async function GET(request: Request) {
  try {
    const user = await requireApiUser();
    const { q, classId, date } = parseSearch(request.url);
    const url = new URL(request.url);
    if (url.searchParams.get("summary") === "me" && user.role === "STUDENT") {
      return jsonOk(await studentAttendanceSummary(user.id));
    }
    if (classId && date && user.role !== "STUDENT") {
      return jsonOk({ roster: await rosterForDate(user, classId, date) });
    }
    return jsonOk({ records: await listAttendance(user, classId, date, q) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const body = await request.json();
    return jsonOk(await saveAttendance(user, body));
  } catch (error) {
    return jsonError(error);
  }
}
