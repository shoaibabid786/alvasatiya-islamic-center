import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { syncAllUsersToFirebase } from "@/lib/firebase/user-sync";

export async function POST() {
  try {
    await requireApiUser(["ADMIN"]);
    await syncAllUsersToFirebase();
    return jsonOk({ ok: true, message: "Admin, teacher, and student records were saved to Firebase." });
  } catch (error) {
    return jsonError(error);
  }
}
