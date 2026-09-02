import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { dashboardFor } from "@/lib/lms/dashboard";

export async function GET() {
  try {
    const user = await requireApiUser();
    return jsonOk(await dashboardFor(user));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST() {
  try {
    const user = await requireApiUser(["ADMIN"]);
    return jsonOk({ user });
  } catch (error) {
    return jsonError(error);
  }
}
