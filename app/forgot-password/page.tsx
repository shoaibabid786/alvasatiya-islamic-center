import { ForgotForm } from "@/components/academy/AuthForms";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Forgot Password", "Request a password reset for your Alvasatiya academy account.", "/forgot-password", { index: false });

export default function Page() {
  return (
    <section className="section-container py-16 flex justify-center">
      <ForgotForm />
    </section>
  );
}
