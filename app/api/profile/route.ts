import { getSessionUser } from "@/lib/auth";
import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { changePassword, updateProfile } from "@/lib/lms/users";

export async function GET() {
  try {
    const user = await requireApiUser();
    return jsonOk({ user });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await request.json();
    if (body.currentPassword && body.newPassword) return jsonOk(await changePassword(user, body));
    return jsonOk({ user: await updateProfile(user, body), message: "Profile updated successfully" });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST() {
  const user = await getSessionUser();
  return jsonOk({ user });
}
