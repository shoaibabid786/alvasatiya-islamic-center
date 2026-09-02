"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, useToast } from "@/components/lms/toast";
import { Field, LoadingState } from "@/components/lms/ui";

export default function QuizTake() {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const [data, setData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remaining, setRemaining] = useState(0);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    api<any>(`/api/quizzes/${id}/attempt`)
      .then((payload) => {
        setData(payload);
        const elapsed = payload.attempt?.startedAt ? Math.floor((Date.now() - new Date(payload.attempt.startedAt).getTime()) / 1000) : 0;
        setRemaining(Math.max(0, payload.quiz.timeLimitMin * 60 - elapsed));
      })
      .catch(async (err) => {
        if (String(err.message).includes("already submitted")) {
          const quiz = await api<any>(`/api/quizzes/${id}`);
          setResult({
            score: quiz.attempt?.score ?? 0,
            totalMarks: quiz.totalMarks,
            percentage: quiz.totalMarks ? Math.round(((quiz.attempt?.score ?? 0) / quiz.totalMarks) * 1000) / 10 : 0,
            correct: "—",
            wrong: "—",
          });
          return;
        }
        push(err.message, "error");
      });
  }, [id]);

  useEffect(() => {
    if (!data || result) return;
    const timer = setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          clearInterval(timer);
          submit();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [data, result]);

  async function submit() {
    if (result) return;
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selected]) => ({ questionId, selected })),
      };
      const res = await api(`/api/quizzes/${id}/attempt`, { method: "POST", body: JSON.stringify(payload) });
      setResult(res);
      push("Quiz submitted successfully");
    } catch (err) {
      push(err instanceof Error ? err.message : "Something went wrong", "error");
    }
  }

  if (!data) return <LoadingState />;
  if (result) {
    return (
      <div className="lms-card p-8 max-w-xl">
        <h1 className="text-2xl font-semibold">Quiz result</h1>
        <div className="mt-4 grid gap-2 text-sm">
          <p>Score: {result.score}</p>
          <p>Total marks: {result.totalMarks}</p>
          <p>Percentage: {result.percentage}%</p>
          <p>Correct answers: {result.correct}</p>
          <p>Wrong answers: {result.wrong}</p>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{data.quiz.title}</h1>
          <p className="text-sm text-slate-500">{data.quiz.questions.length} questions · {data.quiz.totalMarks} marks</p>
        </div>
        <div className="rounded-xl bg-teal-50 px-4 py-2 font-semibold text-teal-800">
          {minutes}:{String(seconds).padStart(2, "0")}
        </div>
      </div>
      {data.quiz.questions.map((question: any, index: number) => (
        <div key={question.id} className="lms-card p-5 space-y-2">
          <p className="font-medium">
            {index + 1}. {question.prompt}
          </p>
          {(["A", "B", "C", "D"] as const).map((choice) => (
            <label key={choice} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={question.id}
                checked={answers[question.id] === choice}
                onChange={() => setAnswers({ ...answers, [question.id]: choice })}
              />
              {choice}. {question[`option${choice}`]}
            </label>
          ))}
        </div>
      ))}
      <button className="lms-btn lms-btn-primary" onClick={submit}>
        Submit quiz
      </button>
    </div>
  );
}
