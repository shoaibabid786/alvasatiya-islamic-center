"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, useToast } from "@/components/lms/toast";
import { Badge, EmptyState, Field, LoadingState, statusTone } from "@/components/lms/ui";

function toDateInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function ClassDetail({ role }: { role: "ADMIN" | "TEACHER" | "STUDENT" }) {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const [data, setData] = useState<any>(null);
  const [students, setStudents] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [teachers, setTeachers] = useState<Array<{ id: string; name: string; email?: string }>>([]);
  const [addId, setAddId] = useState("");
  const [edit, setEdit] = useState({ name: "", subject: "", description: "", teacherId: "", startDate: "", endDate: "", status: "ACTIVE" });

  async function load() {
    const detail = await api<any>(`/api/classes/${id}`);
    setData(detail);
    setEdit({
      name: detail.name || "",
      subject: detail.subject || "",
      description: detail.description || "",
      teacherId: detail.teacher?.id || detail.teacherId || "",
      startDate: toDateInput(detail.startDate),
      endDate: toDateInput(detail.endDate),
      status: detail.status || "ACTIVE",
    });
  }

  useEffect(() => {
    load().catch((err) => push(err.message, "error"));
    if (role === "ADMIN") {
      api<{ students: Array<{ id: string; name: string; email: string }> }>("/api/classes?select=students").then((res) => setStudents(res.students));
      api<{ teachers: Array<{ id: string; name: string; email?: string }> }>("/api/classes?select=teachers").then((res) => setTeachers(res.teachers));
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
        {role === "ADMIN" ? (
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
        ) : null}
      </div>

      {role === "ADMIN" ? (
        <form
          className="lms-card grid gap-3 p-6"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const result = await api<{ message: string }>(`/api/classes/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ ...edit, teacherId: edit.teacherId || null }),
              });
              push(result.message);
              load();
            } catch (err) {
              push(err instanceof Error ? err.message : "Could not update class", "error");
            }
          }}
        >
          <h2 className="font-semibold">Edit class and shift teacher</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Class name">
              <input required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            </Field>
            <Field label="Subject">
              <input required value={edit.subject} onChange={(e) => setEdit({ ...edit, subject: e.target.value })} />
            </Field>
          </div>
          <Field label="Description">
            <textarea rows={3} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
          </Field>
          <Field label="Teacher for this class">
            <select value={edit.teacherId} onChange={(e) => setEdit({ ...edit, teacherId: e.target.value })}>
              <option value="">Unassigned</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}{teacher.email ? ` · ${teacher.email}` : ""}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Start date">
              <input type="date" value={edit.startDate} onChange={(e) => setEdit({ ...edit, startDate: e.target.value })} />
            </Field>
            <Field label="End date">
              <input type="date" value={edit.endDate} onChange={(e) => setEdit({ ...edit, endDate: e.target.value })} />
            </Field>
            <Field label="Status">
              <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                <option>ACTIVE</option>
                <option>INACTIVE</option>
                <option>COMPLETED</option>
              </select>
            </Field>
          </div>
          <button className="lms-btn lms-btn-primary w-fit">Save class changes</button>
        </form>
      ) : null}

      <div className="lms-card p-6">
        <h2 className="font-semibold mb-3">Enrolled students</h2>
        <p className="mb-3 text-sm text-slate-500">
          {role === "ADMIN"
            ? "Add students to this class. When you schedule a live session, these students will see Join class."
            : "Students enrolled by the administrator. Teachers cannot add students or create joining links."}
        </p>
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
              <option value="">Select student by name or email</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.email})
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
          <EmptyState title="No students enrolled" body={role === "ADMIN" ? "Add students or share the class joining code." : "Ask an administrator to add students to this class."} />
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
