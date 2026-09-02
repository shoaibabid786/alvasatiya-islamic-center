"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Payload = {
  payment: { id: string; status: string; amountLabel: string; courseSlug: string };
  courseTitle: string;
};

export default function PaymentCheckout({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [payload, setPayload] = useState<Payload | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    fetch(`/api/payments/${paymentId}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Payment not found.");
        setPayload(data);
      })
      .catch((err) => setError(err.message));
  }, [paymentId]);

  if (error) {
    return (
      <div className="section-container py-12">
        <p className="text-red-700">{error}</p>
        <Link href="/login" className="btn btn-gold mt-4">Login</Link>
      </div>
    );
  }
  if (!payload) return <div className="section-container py-12 text-muted">Loading checkout...</div>;

  const already = payload.payment.status === "verified";

  return (
    <div className="section-container py-12 max-w-xl">
      <p className="section-eyebrow">Secure checkout</p>
      <h1 className="section-title">{payload.courseTitle}</h1>
      <p className="mt-3 text-muted">{payload.payment.amountLabel}</p>
      <p className="mt-2 text-sm text-muted">
        Clicking pay only asks the server to confirm this payment. Enrollment stays inactive until backend verification succeeds.
      </p>
      {already && <p className="mt-4 font-medium text-green-deep">This payment is already verified. Your portal is unlocked for the course.</p>}
      {message && <p className="mt-4 font-medium text-green-deep">{message}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="btn btn-gold"
          disabled={working || already}
          onClick={async () => {
            setWorking(true);
            const response = await fetch("/api/payments/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
            const data = await response.json();
            setWorking(false);
            if (!response.ok) {
              setError(data.error || "Verification failed.");
              return;
            }
            setMessage(data.message);
            setTimeout(() => router.push("/portal/student"), 800);
          }}
        >
          {working ? "Verifying on server..." : "Pay and verify on server"}
        </button>
        <Link href={`/courses/${payload.payment.courseSlug}`} className="btn btn-outline">Back to course</Link>
      </div>
    </div>
  );
}
