import { jsonError, jsonOk, parseSearch, requireApiUser } from "@/lib/lms/http";
import { createStudent, listUsers } from "@/lib/lms/users";

export async function GET(request: Request) {
  try {
    const user = await requireApiUser(["ADMIN", "TEACHER"]);
    const { q, page, pageSize, status } = parseSearch(request.url);
    if (user.role === "ADMIN") return jsonOk(await listUsers("STUDENT", q, status, page, pageSize));
    const { prisma } = await import("@/lib/prisma");
    const { toPublicUser } = await import("@/lib/auth");
    const classes = await prisma.class.findMany({ where: { teacherId: user.id }, select: { id: true } });
    const members = await prisma.classMember.findMany({
      where: {
        classId: { in: classes.map((item) => item.id) },
        ...(q ? { student: { OR: [{ name: { contains: q } }, { email: { contains: q } }] } } : {}),
      },
      include: { student: true, class: true },
    });
    const unique = new Map(members.map((item) => [item.studentId, item.student]));
    return jsonOk({
      total: unique.size,
      page: 1,
      pageSize: unique.size,
      users: [...unique.values()].map(toPublicUser),
    });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireApiUser(["ADMIN"]);
    const body = await request.json();
    const student = await createStudent(body);
    return jsonOk({ student, message: "Student created successfully" }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
