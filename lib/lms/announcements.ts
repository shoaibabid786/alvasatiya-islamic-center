import { prisma } from "@/lib/prisma";
import { toPublicUser, type PublicUser } from "@/lib/auth";
import { announcementSchema } from "@/lib/lms/schemas";
import { HttpError } from "@/lib/lms/types";
import { assertClassAccess, studentClassIds, teacherClassIds } from "@/lib/lms/http";

export async function listAnnouncements(user: PublicUser, classId = "") {
  const classIds =
    user.role === "STUDENT" ? await studentClassIds(user.id) : user.role === "TEACHER" ? await teacherClassIds(user) : undefined;
  return prisma.announcement.findMany({
    where: {
      ...(classIds ? { classId: { in: classIds } } : {}),
      ...(classId ? { classId } : {}),
      ...(user.role === "STUDENT" ? { publishDate: { lte: new Date() } } : {}),
    },
    include: { class: true, author: true },
    orderBy: { publishDate: "desc" },
  }).then((rows) => rows.map((row) => ({ ...row, author: toPublicUser(row.author) })));
}

export async function saveAnnouncement(user: PublicUser, body: unknown, id?: string) {
  const data = announcementSchema.parse(body);
  await assertClassAccess(user, data.classId, "manage");
  if (id) {
    const current = await prisma.announcement.findUnique({ where: { id } });
    if (!current) throw new HttpError(404, "Announcement not found.");
    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        title: data.title,
        message: data.message,
        classId: data.classId,
        publishDate: data.publishDate ? new Date(data.publishDate) : current.publishDate,
      },
    });
    return { ...updated, message: "Announcement updated successfully" };
  }
  const created = await prisma.announcement.create({
    data: {
      title: data.title,
      message: data.message,
      classId: data.classId,
      authorId: user.id,
      publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
    },
  });
  return { ...created, message: "Announcement created successfully" };
}

export async function deleteAnnouncement(user: PublicUser, id: string) {
  const current = await prisma.announcement.findUnique({ where: { id } });
  if (!current) throw new HttpError(404, "Announcement not found.");
  await assertClassAccess(user, current.classId, "manage");
  await prisma.announcement.delete({ where: { id } });
  return { ok: true, message: "Announcement deleted successfully" };
}
