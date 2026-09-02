import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/lms/http";
import { readUpload } from "@/lib/lms/files";
import { jsonError } from "@/lib/lms/http";
import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/lms/types";

export async function GET(_: Request, context: { params: Promise<{ path: string[] }> }) {
  try {
    const user = await requireApiUser();
    const { path: parts } = await context.params;
    const storedPath = parts.join("/");
    if (storedPath.startsWith("assignments/")) {
      const submission = await prisma.assignmentSubmission.findFirst({
        where: { filePath: storedPath },
        include: { assignment: true },
      });
      if (!submission) throw new HttpError(404, "File not found.");
      const can =
        user.role === "ADMIN" ||
        submission.studentId === user.id ||
        (user.role === "TEACHER" && submission.assignment.teacherId === user.id);
      if (!can) throw new HttpError(403, "Unauthorized access");
    }
    const buffer = await readUpload(storedPath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${parts.at(-1) || "file"}"`,
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
