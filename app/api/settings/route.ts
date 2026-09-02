import { jsonError, jsonOk, requireApiUser } from "@/lib/lms/http";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/lms/schemas";

export async function GET() {
  try {
    await requireApiUser(["ADMIN"]);
    const rows = await prisma.setting.findMany();
    return jsonOk(Object.fromEntries(rows.map((row) => [row.key, row.value])));
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireApiUser(["ADMIN"]);
    const data = settingsSchema.parse(await request.json());
    for (const [key, value] of Object.entries(data)) {
      if (!value) continue;
      await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
    }
    return jsonOk({ ok: true, message: "Settings saved successfully" });
  } catch (error) {
    return jsonError(error);
  }
}
