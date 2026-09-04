import { jsonError, jsonOk } from "@/lib/lms/http";
import { saveUpload } from "@/lib/lms/files";
import { HttpError } from "@/lib/lms/types";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      throw new HttpError(400, "Please upload your payment slip.");
    }
    const stored = await saveUpload(file, "donations");
    return jsonOk({
      filePath: stored.filePath,
      originalName: stored.originalName,
    });
  } catch (error) {
    return jsonError(error);
  }
}
