import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEMO_ACCOUNTS } from "@/lib/lms/demo-accounts";
import { syncUserToFirebase } from "@/lib/firebase/user-sync";

let ready = false;
let inflight: Promise<void> | null = null;

export async function ensureDemoAccounts() {
  if (ready) return;
  if (inflight) return inflight;
  inflight = (async () => {
    for (const account of Object.values(DEMO_ACCOUNTS)) {
      const existing = await prisma.user.findUnique({ where: { email: account.email } });
      if (existing) continue;
      const created = await prisma.user.create({
        data: {
          name: account.name,
          email: account.email,
          passwordHash: hashPassword(account.password),
          role: account.role,
          status: "ACTIVE",
          qualification: "qualification" in account ? account.qualification : null,
          experience: "experience" in account ? account.experience : null,
          studentCode: "studentCode" in account ? account.studentCode : null,
        },
      });
      await syncUserToFirebase(created, { password: account.password });
    }
    ready = true;
  })().finally(() => {
    inflight = null;
  });
  return inflight;
}
