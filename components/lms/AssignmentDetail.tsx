"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, useToast } from "@/components/lms/toast";
import { Badge, Field, LoadingState, statusTone } from "@/components/lms/ui";

export default function AssignmentDetail({ role }: { role: "ADMIN" | "TEACHER" | "STUDENT" }) {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const [data, setData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    setData(await api(`/api/assignments/${id}`));
  }

  useEffect(() => {
    load().catch((err) => push(err.message, "error"));
  }, [id]);

  if (!data) return <LoadingState />;

  return (
    <div className="space-y-5">
      <div className="lms-card p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{data.title}</h1>
            <p className="text-sm text-slate-500">{data.class?.name} · due {new Date(data.dueDate).toLocaleString()}</p>
          </div>
          <Badge tone={statusTone(data.status)}>{data.status}</Badge>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{data.description}</p>
        <p className="mt-2 text-sm">Total marks: {data.totalMarks}</p>
        {data.attachment ? (
          <a className="mt-2 inline-block text-teal-700" href={`/api/files/${data.attachment}`}>
            Download attachment
          </a>
        ) : null}
      </div>

      {role === "STUDENT" ? (
        <div className="lms-card p-6 space-y-3">
          <h2 className="font-semibold">Your submission</h2>
          {data.submission ? (
            <div className="text-sm space-y-1">
              <p>Status: {data.submission.status}</p>
              {data.submission.originalName ? <p>File: {data.submission.originalName}</p> : null}
              {data.submission.marks != null ? (
                <>
                  <p>
                    Marks: {data.submission.marks} / {data.totalMarks}
                  </p>
                  <p>Feedback: {data.submission.feedback || "—"}</p>
                </>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Not submitted yet.</p>
          )}
          {data.submission?.status !== "GRADED" ? (
            <form
              className="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!file) return push("Please choose a file to upload.", "error");
                const body = new FormData();
                body.append("file", file);
                try {
                  const result = await api<{ message: string }>(`/api/assignments/${id}/submit`, { method: "POST", body });
                  push(result.message);
                  load();
                } catch (err) {
                  push(err instanceof Error ? err.message : "Something went wrong", "error");
                }
              }}
            >
              <Field label="Upload file (PDF, DOC, PPT, images, ZIP · max 10MB)">
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </Field>
              <button className="lms-btn lms-btn-primary">Submit assignment</button>
            </form>
          ) : null}
        </div>
      ) : (
        <div className="lms-card p-6">
          <h2 className="font-semibold mb-3">Submissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Student</th>
                  <th>Status</th>
                  <th>File</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {(data.submissions || []).map((item: any) => (
                  <tr key={item.id} className="border-t border-slate-100 align-top">
                    <td className="py-2">{item.student?.name}</td>
                    <td>
                      <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                    </td>
                    <td>
                      {item.filePath ? (
                        <a className="text-teal-700" href={`/api/files/${item.filePath}`}>
                          Download
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <form
                        className="flex flex-wrap gap-2 py-2"
                        onSubmit={async (event) => {
                          event.preventDefault();
                          const formEl = event.currentTarget;
                          const marks = Number((formEl.elements.namedItem("marks") as HTMLInputElement).value);
                          const feedback = (formEl.elements.namedItem("feedback") as HTMLInputElement).value;
                          try {
                            const result = await api<{ message: string }>(`/api/submissions/${item.id}`, {
                              method: "PATCH",
                              body: JSON.stringify({ marks, feedback }),
                            });
                            push(result.message);
                            load();
                          } catch (err) {
                            push(err instanceof Error ? err.message : "Something went wrong", "error");
                          }
                        }}
                      >
                        <input name="marks" type="number" min={0} max={data.totalMarks} defaultValue={item.marks ?? ""} className="w-24" placeholder="Marks" />
                        <input name="feedback" defaultValue={item.feedback || ""} placeholder="Feedback" />
                        <button className="lms-btn lms-btn-primary">Grade</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
