import { NextResponse } from "next/server";
import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { readUpload, saveUpload } from "@/lib/lms/files";
import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/lms/types";

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "attachments");
    if (!(file instanceof File)) throw new HttpError(400, "Please choose a file to upload.");
    const allowed = folder === "profiles" || folder === "attachments" || folder === "assignments";
    if (!allowed) throw new HttpError(400, "Invalid upload folder.");
    const stored = await saveUpload(file, folder);
    if (folder === "profiles") {
      await prisma.user.update({ where: { id: user.id }, data: { profilePicture: stored.filePath } });
    }
    return jsonOk({ ...stored, url: `/api/files/${stored.filePath}` });
  } catch (error) {
    return jsonError(error);
  }
}
