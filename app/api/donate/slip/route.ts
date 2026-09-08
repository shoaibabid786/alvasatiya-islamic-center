import { sendInquiryEmail } from "@/lib/inquiries";
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
    try {
      await sendInquiryEmail("donate", {
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        category: String(form.get("category") || ""),
        method: "HBL / JazzCash",
        slip: stored.originalName,
      });
    } catch {
      /* Slip is stored even if inbox delivery is delayed. */
    }
    return jsonOk({
      filePath: stored.filePath,
      originalName: stored.originalName,
    });
  } catch (error) {
    return jsonError(error);
  }
}
