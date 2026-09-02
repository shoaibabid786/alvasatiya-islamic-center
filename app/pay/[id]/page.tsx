import PaymentCheckout from "@/components/academy/PaymentCheckout";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMeta(
  "Secure Checkout",
  "Complete enrollment payment. Access is activated only after server-side verification.",
  "/pay",
  { index: false }
);

export default async function Page({ params }: PageProps<"/pay/[id]">) {
  const { id } = await params;
  return <PaymentCheckout paymentId={id} />;
}
