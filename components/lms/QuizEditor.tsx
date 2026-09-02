"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, useToast } from "@/components/lms/toast";
import { Field, LoadingState } from "@/components/lms/ui";

const emptyQuestion = { prompt: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A", marks: 1 };

export default function QuizEditor({ base }: { base: string }) {
  const params = useParams<{ id: string }>();
  const isNew = !params.id || params.id === "new";
  const router = useRouter();
  const { push } = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [form, setForm] = useState({
    title: "",
    description: "",
    classId: "",
    startDate: "",
    endDate: "",
    timeLimitMin: 30,
    passingMarks: 0,
    status: "DRAFT",
    questions: [{ ...emptyQuestion }],
  });

  useEffect(() => {
    api<{ classes: any[] }>("/api/classes").then((data) => {
      setClasses(data.classes);
      if (data.classes[0] && !form.classId) setForm((current) => ({ ...current, classId: data.classes[0].id }));
    });
    if (!isNew) {
      api<any>(`/api/quizzes/${params.id}`).then((quiz) => {
        setForm({
          title: quiz.title,
          description: quiz.description,
          classId: quiz.classId,
          startDate: quiz.startDate ? quiz.startDate.slice(0, 16) : "",
          endDate: quiz.endDate ? quiz.endDate.slice(0, 16) : "",
          timeLimitMin: quiz.timeLimitMin,
          passingMarks: quiz.passingMarks,
          status: quiz.status,
          questions: quiz.questions?.length ? quiz.questions : [{ ...emptyQuestion }],
        });
        setLoading(false);
      });
    }
  }, [isNew, params.id]);

  if (loading) return <LoadingState />;

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          const payload = { ...form, startDate: form.startDate || null, endDate: form.endDate || null };
          const result = isNew
            ? await api<{ id?: string; message: string }>("/api/quizzes", { method: "POST", body: JSON.stringify(payload) })
            : await api<{ message: string }>(`/api/quizzes/${params.id}`, { method: "PATCH", body: JSON.stringify(payload) });
          push(result.message);
          router.push(`${base}/quizzes`);
        } catch (err) {
          push(err instanceof Error ? err.message : "Something went wrong", "error");
        }
      }}
    >
      <h1 className="text-2xl font-semibold">{isNew ? "Create quiz" : "Edit quiz"}</h1>
      <div className="lms-card p-6 grid gap-3">
        <Field label="Quiz title">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label="Class">
          <select required value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Start date">
            <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </Field>
          <Field label="End date">
            <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Time limit (minutes)">
            <input type="number" min={1} value={form.timeLimitMin} onChange={(e) => setForm({ ...form, timeLimitMin: Number(e.target.value) })} />
          </Field>
          <Field label="Passing marks">
            <input type="number" min={0} value={form.passingMarks} onChange={(e) => setForm({ ...form, passingMarks: Number(e.target.value) })} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>DRAFT</option>
              <option>PUBLISHED</option>
              <option>UNPUBLISHED</option>
              <option>CLOSED</option>
            </select>
          </Field>
        </div>
      </div>
      <div className="space-y-4">
        {form.questions.map((question, index) => (
          <div key={index} className="lms-card p-5 grid gap-3">
            <div className="flex justify-between">
              <h2 className="font-semibold">Question {index + 1}</h2>
              <button
                type="button"
                className="text-red-600 text-sm"
                onClick={() => setForm({ ...form, questions: form.questions.filter((_, i) => i !== index) })}
              >
                Delete question
              </button>
            </div>
            <Field label="Question">
              <textarea required value={question.prompt} onChange={(e) => {
                const questions = [...form.questions];
                questions[index] = { ...question, prompt: e.target.value };
                setForm({ ...form, questions });
              }} />
            </Field>
            {(["optionA", "optionB", "optionC", "optionD"] as const).map((key, optIndex) => (
              <Field key={key} label={`Option ${["A", "B", "C", "D"][optIndex]}`}>
                <input required value={question[key]} onChange={(e) => {
                  const questions = [...form.questions];
                  questions[index] = { ...question, [key]: e.target.value };
                  setForm({ ...form, questions });
                }} />
              </Field>
            ))}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Correct answer">
                <select value={question.correctAnswer} onChange={(e) => {
                  const questions = [...form.questions];
                  questions[index] = { ...question, correctAnswer: e.target.value };
                  setForm({ ...form, questions });
                }}>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                </select>
              </Field>
              <Field label="Marks">
                <input type="number" min={1} value={question.marks} onChange={(e) => {
                  const questions = [...form.questions];
                  questions[index] = { ...question, marks: Number(e.target.value) };
                  setForm({ ...form, questions });
                }} />
              </Field>
            </div>
          </div>
        ))}
        <button type="button" className="lms-btn lms-btn-ghost" onClick={() => setForm({ ...form, questions: [...form.questions, { ...emptyQuestion }] })}>
          Add question
        </button>
      </div>
      <button className="lms-btn lms-btn-primary">Save quiz</button>
    </form>
  );
}
