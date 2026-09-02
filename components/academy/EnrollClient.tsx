"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Course } from "@/data/courses";
import Link from "next/link";

export default function EnrollClient({ course }: { course: Course }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <div className="section-container py-12 max-w-xl">
      <p className="section-eyebrow">Enrollment</p>
      <h1 className="section-title">{course.title}</h1>
      <p className="mt-4 text-muted">
        Complete enrollment, then pay through the secure checkout. Your student portal unlocks only after the server verifies the payment.
      </p>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="btn btn-gold"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            setError("");
            const response = await fetch("/api/enroll", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ courseSlug: course.slug }),
            });
            const data = await response.json();
            setSaving(false);
            if (response.status === 401) {
              router.push(`/login?next=/courses/${course.slug}/enroll`);
              return;
            }
            if (!response.ok) {
              setError(data.error || "Could not start enrollment.");
              return;
            }
            router.push(data.checkoutPath);
          }}
        >
          {saving ? "Preparing checkout..." : "Continue to payment"}
        </button>
        <Link href={`/demo?course=${course.slug}`} className="btn btn-outline">Book a free demo first</Link>
      </div>
    </div>
  );
}
