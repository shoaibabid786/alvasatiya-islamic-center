"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, useToast } from "@/components/lms/toast";
import { Field } from "@/components/lms/ui";

export default function JoinClassView({ initialCode = "" }: { initialCode?: string }) {
  const { push } = useToast();
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Join class</h1>
      <p className="mt-1 text-sm text-slate-500">Paste a class joining link or enter a class code such as ABC123.</p>
      <form
        className="lms-card mt-5 space-y-4 p-6"
        onSubmit={async (event) => {
          event.preventDefault();
          setMessage("");
          try {
            const result = await api<{ message: string }>("/api/classes/join", { method: "POST", body: JSON.stringify({ code }) });
            setMessage(result.message);
            push(result.message);
            router.push("/student/classes");
          } catch (err) {
            setMessage(err instanceof Error ? err.message : "Invalid class code");
            push(err instanceof Error ? err.message : "Invalid class code", "error");
          }
        }}
      >
        <Field label="Class code or link">
          <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="QRN101 or https://yourdomain.com/join/QRN101" />
        </Field>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        <button className="lms-btn lms-btn-primary">Join class</button>
      </form>
    </div>
  );
}
