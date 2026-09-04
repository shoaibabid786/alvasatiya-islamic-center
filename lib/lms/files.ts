import { randomBytes } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { assertAllowedFile, fileExtension, HttpError } from "@/lib/lms/types";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

export async function saveUpload(file: File, folder: "assignments" | "profiles" | "attachments" | "donations") {
  assertAllowedFile(file.name, file.size);
  const ext = fileExtension(file.name);
  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const full = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(full, buffer);
  const storedPath = `${folder}/${filename}`;
  return {
    filePath: storedPath,
    originalName: file.name,
    mimeType: file.type || "application/octet-stream",
    fileSize: file.size,
  };
}

export async function readUpload(storedPath: string) {
  const normalized = storedPath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (normalized.includes("..")) throw new HttpError(400, "Invalid file path");
  const full = path.join(UPLOAD_ROOT, normalized);
  if (!full.startsWith(UPLOAD_ROOT)) throw new HttpError(400, "Invalid file path");
  try {
    return await readFile(full);
  } catch {
    throw new HttpError(404, "File not found.");
  }
}
