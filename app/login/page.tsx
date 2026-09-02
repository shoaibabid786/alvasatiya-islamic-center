import { Suspense } from "react";
import LmsLoginForm from "@/components/lms/LmsLoginForm";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="lms-app grid min-h-screen place-items-center text-slate-500">Loading login...</div>}>
      <LmsLoginForm />
    </Suspense>
  );
}
