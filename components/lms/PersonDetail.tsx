"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, useToast } from "@/components/lms/toast";
import { Badge, Field, LoadingState, statusTone } from "@/components/lms/ui";

export default function PersonDetail({ kind }: { kind: "teachers" | "students" }) {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const [data, setData] = useState<any>(null);
  const endpoint = kind === "teachers" ? "/api/teachers" : "/api/students";

  useEffect(() => {
    api(endpoint + "/" + id)
      .then(setData)
      .catch((err) => push(err.message, "error"));
  }, [id, endpoint]);

  if (!data) return <LoadingState />;
  const user = data.user;

  return (
    <div className="space-y-5">
      <div className="lms-card p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <p className="text-slate-500">{user.email}</p>
            {user.studentCode ? <p className="text-sm text-slate-500">{user.studentCode}</p> : null}
          </div>
          <Badge tone={statusTone(user.status)}>{user.status}</Badge>
        </div>
        <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>Phone: {user.phone || "—"}</p>
          <p>Role: {user.role}</p>
          {kind === "teachers" ? (
            <>
              <p>Qualification: {user.qualification || "—"}</p>
              <p>Experience: {user.experience || "—"}</p>
            </>
          ) : (
            <p>Date of birth: {user.dateOfBirth || "—"}</p>
          )}
        </div>
      </div>
      <div className="lms-card p-6">
        <h2 className="font-semibold mb-3">{kind === "teachers" ? "Assigned classes" : "Enrolled classes"}</h2>
        {(data.classes || []).map((item: any) => (
          <p key={item.id} className="text-sm py-1">
            {item.name} · {item.subject} · {item.status}
          </p>
        ))}
      </div>
      {kind === "students" && data.attendanceSummary ? (
        <div className="lms-card p-6">
          <h2 className="font-semibold mb-3">Attendance</h2>
          <p>Present {data.attendanceSummary.present} · Absent {data.attendanceSummary.absent} · {data.attendanceSummary.percentage}%</p>
        </div>
      ) : null}
      {kind === "students" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="lms-card p-6">
            <h2 className="font-semibold mb-3">Quiz results</h2>
            {(data.quizzes || []).map((item: any) => (
              <p key={item.id} className="text-sm py-1">
                {item.quiz?.title}: {item.score}
              </p>
            ))}
          </div>
          <div className="lms-card p-6">
            <h2 className="font-semibold mb-3">Assignment results</h2>
            {(data.assignments || []).map((item: any) => (
              <p key={item.id} className="text-sm py-1">
                {item.assignment?.title}: {item.status}
                {item.marks != null ? ` · ${item.marks}` : ""}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="lms-card p-6">
          <h2 className="font-semibold mb-3">Activity</h2>
          <p className="text-sm">Classes {data.activity?.classes} · Quizzes {data.activity?.quizzes} · Assignments {data.activity?.assignments}</p>
        </div>
      )}
      {kind === "teachers" ? (
        <Field label=" ">
          <span />
        </Field>
      ) : null}
    </div>
  );
}
