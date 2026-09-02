"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, useToast } from "@/components/lms/toast";
import { Badge, ConfirmDialog, EmptyState, LoadingState, statusTone } from "@/components/lms/ui";

export default function QuizzesManager({ role, base }: { role: "ADMIN" | "TEACHER" | "STUDENT"; base: string }) {
  const { push } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  async function load() {
    const data = await api<{ quizzes: any[] }>(`/api/quizzes?q=${encodeURIComponent(q)}`);
    setRows(data.quizzes);
  }

  useEffect(() => {
    load().catch((err) => push(err.message, "error"));
  }, [q]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Quizzes</h1>
        {role !== "STUDENT" ? (
          <Link href={`${base}/quizzes/new`} className="lms-btn lms-btn-primary">
            Create quiz
          </Link>
        ) : null}
      </div>
      <input className="max-w-xs" placeholder="Search quizzes" value={q} onChange={(e) => setQ(e.target.value)} />
      {rows.length === 0 ? (
        <EmptyState title="No quizzes" body="Published quizzes for your classes will appear here." />
      ) : (
        <div className="grid gap-4">
          {rows.map((row) => (
            <div key={row.id} className="lms-card p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{row.title}</p>
                <p className="text-sm text-slate-500">
                  {row.class?.name} · {row._count?.questions || 0} questions · {row.totalMarks} marks · {row.timeLimitMin} min
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                {role === "STUDENT" ? (
                  <Link href={`/student/quizzes/${row.id}/take`} className="lms-btn lms-btn-primary">
                    {row.attempts?.[0]?.status === "SUBMITTED" ? "View result" : "Start quiz"}
                  </Link>
                ) : (
                  <>
                    <Link href={`${base}/quizzes/${row.id}`} className="lms-btn lms-btn-ghost">
                      Open
                    </Link>
                    <button
                      className="lms-btn lms-btn-ghost"
                      onClick={async () => {
                        const status = row.status === "PUBLISHED" ? "UNPUBLISHED" : "PUBLISHED";
                        const result = await api<{ message: string }>(`/api/quizzes/${row.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
                        push(result.message);
                        load();
                      }}
                    >
                      {row.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                    </button>
                    <button className="text-red-600 text-sm" onClick={() => setPending(row.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete quiz?"
        body="Student attempts for this quiz will also be removed."
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          const result = await api<{ message: string }>(`/api/quizzes/${pending}`, { method: "DELETE" });
          push(result.message);
          setPending(null);
          load();
        }}
      />
    </div>
  );
}
