export type StoredForm = {
  id: string;
  type: "contact" | "feedback" | "fatwa" | "donate" | "enroll" | "event";
  createdAt: string;
  payload: Record<string, string | number>;
};

const KEY = "alvasatiya-forms";

export function saveForm(type: StoredForm["type"], payload: Record<string, string | number>) {
  const entry: StoredForm = {
    id: crypto.randomUUID(),
    type,
    createdAt: new Date().toISOString(),
    payload,
  };
  if (typeof window === "undefined") return entry;
  const current: StoredForm[] = JSON.parse(localStorage.getItem(KEY) || "[]");
  current.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(current.slice(0, 100)));
  return entry;
}

export async function submitInquiry(type: StoredForm["type"] | "demo", payload: Record<string, string | number>) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, ...payload }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Could not send your message. Please email alvasatiya4@gmail.com.");
  }
  if (data.via === "client" && data.inbox && data.fields) {
    const { sendInboxFromBrowser } = await import("@/lib/inbox-client");
    await sendInboxFromBrowser({
      inbox: data.inbox,
      title: data.title,
      fields: data.fields,
      replyTo: data.replyTo,
    });
  }
  if (type !== "demo") saveForm(type, payload);
  return data as { ok: boolean; message?: string };
}
