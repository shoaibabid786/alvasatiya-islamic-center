"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, useToast } from "@/components/lms/toast";
import { Badge, EmptyState, Field, LoadingState, statusTone } from "@/components/lms/ui";

export default function ClassDetail({ role }: { role: "ADMIN" | "TEACHER" | "STUDENT" }) {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const [data, setData] = useState<any>(null);
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [addId, setAddId] = useState("");

  async function load() {
    setData(await api(`/api/classes/${id}`));
  }

  useEffect(() => {
    load().catch((err) => push(err.message, "error"));
    if (role === "ADMIN") {
      api<{ students: Array<{ id: string; name: string }> }>("/api/classes?select=students").then((res) => setStudents(res.students));
    }
  }, [id, role]);

  if (!data) return <LoadingState />;

  return (
    <div className="space-y-5">
      <div className="lms-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{data.name}</h1>
            <p className="text-slate-500">{data.subject} · {data.teacher?.name || "No teacher assigned"}</p>
          </div>
          <Badge tone={statusTone(data.status)}>{data.status}</Badge>
        </div>
        <p className="mt-3 text-sm text-slate-600">{data.description}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono">{data.code}</span>
          <button
            className="lms-btn lms-btn-ghost"
            onClick={async () => {
              await navigator.clipboard.writeText(data.joinUrl);
              push("Joining link copied");
            }}
          >
            Copy joining link
          </button>
        </div>
      </div>

      <div className="lms-card p-6">
        <h2 className="font-semibold mb-3">Enrolled students</h2>
        {role === "ADMIN" ? (
          <form
            className="mb-4 flex gap-2"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!addId) return;
              try {
                const result = await api<{ message: string }>(`/api/classes/${id}`, { method: "POST", body: JSON.stringify({ studentId: addId }) });
                push(result.message);
                setAddId("");
                load();
              } catch (err) {
                push(err instanceof Error ? err.message : "Something went wrong", "error");
              }
            }}
          >
            <select value={addId} onChange={(e) => setAddId(e.target.value)}>
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
            <button className="lms-btn lms-btn-primary">Add</button>
          </form>
        ) : null}
        {data.students?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((student: any) => (
                  <tr key={student.id} className="border-t border-slate-100">
                    <td className="py-2">{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      {role === "ADMIN" ? (
                        <button
                          className="text-red-600 text-xs"
                          onClick={async () => {
                            await api(`/api/classes/${id}`, { method: "POST", body: JSON.stringify({ removeStudentId: student.id }) });
                            push("Student removed from class");
                            load();
                          }}
                        >
                          Remove
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No students enrolled" body="Add students or share the class joining code." />
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="lms-card p-6">
          <h2 className="font-semibold mb-3">Quizzes</h2>
          {(data.quizzes || []).map((item: any) => (
            <p key={item.id} className="text-sm py-1">
              {item.title} · {item.status}
            </p>
          ))}
        </div>
        <div className="lms-card p-6">
          <h2 className="font-semibold mb-3">Assignments</h2>
          {(data.assignments || []).map((item: any) => (
            <p key={item.id} className="text-sm py-1">
              {item.title} · {item.status}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
