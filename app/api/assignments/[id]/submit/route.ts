import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { submitAssignment } from "@/lib/lms/assignments";
import { saveUpload } from "@/lib/lms/files";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser(["STUDENT"]);
    const { id } = await context.params;
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) return jsonError(new Error("Please choose a file to upload."));
    const stored = await saveUpload(file, "assignments");
    return jsonOk(await submitAssignment(user, id, stored));
  } catch (error) {
    return jsonError(error);
  }
}
