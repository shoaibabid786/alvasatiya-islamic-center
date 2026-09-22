import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { dashboardPath } from "@/lib/lms/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/portal");
  redirect(dashboardPath(user.role));
}
