import { SignupForm } from "@/components/academy/AuthForms";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Sign Up", "Create a student account at Alvasatiya Islamic Center. Teacher and admin roles are not available during public signup.", "/signup", { index: false });

export default function Page() {
  return (
    <section className="section-container py-16 flex justify-center">
      <SignupForm />
    </section>
  );
}
