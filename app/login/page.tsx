import { Suspense } from "react";
import LmsLoginForm from "@/components/lms/LmsLoginForm";
import { ensureDemoAccounts } from "@/lib/lms/ensure-demo-accounts";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default async function Page() {
  await ensureDemoAccounts();
  return (
    <Suspense fallback={<div className="py-16 text-center text-slate-500">Loading login...</div>}>
      <LmsLoginForm />
    </Suspense>
  );
}
