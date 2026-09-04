"use client";

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="lms-card p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-800">{value}</p>
      {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="lms-card p-10 text-center">
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{body}</p>
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return <div className="py-16 text-center text-slate-500">{label}</div>;
}

export function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "amber" | "red" | "teal" }) {
  const map = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    teal: "bg-teal-50 text-teal-800",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[tone]}`}>{children}</span>;
}

export function statusTone(status: string) {
  const value = status.toUpperCase();
  if (["ACTIVE", "PUBLISHED", "PRESENT", "GRADED", "SUBMITTED", "SCHEDULED"].includes(value)) return "green" as const;
  if (["DRAFT", "LATE", "PENDING", "LEAVE"].includes(value)) return "amber" as const;
  if (["INACTIVE", "ABSENT", "SUSPENDED", "CLOSED"].includes(value)) return "red" as const;
  return "teal" as const;
}

export function BarChart({ items, suffix = "" }: { items: Array<{ label: string; value: number }>; suffix?: string }) {
  const max = Math.max(1, ...items.map((item) => item.value));
  if (!items.length) return <p className="text-sm text-slate-500">No chart data yet.</p>;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span className="truncate pr-3">{item.label}</span>
            <span>
              {item.value}
              {suffix}
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-teal-700" style={{ width: `${Math.max(6, (item.value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ items }: { items: Array<{ label: string; value: number }> }) {
  if (!items.length) return <p className="text-sm text-slate-500">No chart data yet.</p>;
  const max = Math.max(1, ...items.map((item) => item.value));
  const points = items
    .map((item, index) => {
      const x = (index / Math.max(1, items.length - 1)) * 100;
      const y = 100 - (item.value / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <div>
      <svg viewBox="0 0 100 100" className="h-40 w-full overflow-visible" preserveAspectRatio="none">
        <polyline fill="none" stroke="#0F766E" strokeWidth="2" points={points} />
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-slate-400">
        <span>{items[0]?.label}</span>
        <span>{items.at(-1)?.label}</span>
      </div>
    </div>
  );
}

export function ProgressRing({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20">
        <div
          className="h-20 w-20 rounded-full"
          style={{ background: `conic-gradient(#0F766E ${clamped * 3.6}deg, #e2e8f0 0deg)` }}
        />
        <div className="absolute inset-2 rounded-full bg-white grid place-items-center text-sm font-semibold">{clamped}%</div>
      </div>
      <p className="text-sm text-slate-500">Attendance percentage</p>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  onCancel,
  onConfirm,
  confirmLabel = "Delete",
}: {
  open: boolean;
  title: string;
  body: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/40 p-4">
      <div className="lms-card w-full max-w-md p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="lms-btn lms-btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="lms-btn lms-btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/40 p-4">
      <div className="lms-card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="lms-btn lms-btn-ghost !px-3" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
