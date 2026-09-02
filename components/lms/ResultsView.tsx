"use client";

import { useEffect, useState } from "react";
import { api, useToast } from "@/components/lms/toast";
import { EmptyState, LoadingState } from "@/components/lms/ui";

export default function ResultsView({ role }: { role: "TEACHER" | "STUDENT" }) {
  const { push } = useToast();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([api<{ quizzes: any[] }>("/api/quizzes"), api<{ assignments: any[] }>("/api/assignments")])
      .then(([quizData, assignmentData]) => {
        setQuizzes(quizData.quizzes);
        setAssignments(assignmentData.assignments);
      })
      .catch((err) => push(err.message, "error"));
  }, []);

  if (!quizzes && !assignments) return <LoadingState />;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Results</h1>
      <div className="lms-card p-6">
        <h2 className="font-semibold mb-3">Quizzes</h2>
        {quizzes.length === 0 ? (
          <EmptyState title="No quiz results" body="Submitted quizzes will appear here." />
        ) : (
          quizzes.map((item) => (
            <div key={item.id} className="flex justify-between border-b border-slate-100 py-2 text-sm">
              <span>
                {item.title} · {item.class?.name}
              </span>
              <span>
                {role === "STUDENT"
                  ? item.attempts?.[0]
                    ? `${item.attempts[0].score} / ${item.totalMarks}`
                    : "Not attempted"
                  : `${item._count?.attempts || 0} attempts`}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="lms-card p-6">
        <h2 className="font-semibold mb-3">Assignments</h2>
        {assignments.map((item) => (
          <div key={item.id} className="flex justify-between border-b border-slate-100 py-2 text-sm">
            <span>
              {item.title} · {item.class?.name}
            </span>
            <span>
              {role === "STUDENT"
                ? item.submissions?.[0]?.marks != null
                  ? `${item.submissions[0].marks} / ${item.totalMarks}`
                  : item.submissions?.[0]?.status || "Not submitted"
                : `${item._count?.submissions || 0} submissions`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
