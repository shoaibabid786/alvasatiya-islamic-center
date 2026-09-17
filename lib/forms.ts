import { SITE } from "@/data/site";
import { deliverInquiryHttp, inquiryTextFromPayload } from "@/lib/contact-http";

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

async function postToContactApi(type: StoredForm["type"] | "demo", payload: Record<string, string | number>) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...payload }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "Could not send your message.");
    }
    return data as { ok: boolean; message?: string; via?: string };
  } finally {
    clearTimeout(timer);
  }
}

async function postToInboxBackup(type: StoredForm["type"] | "demo", payload: Record<string, string | number>) {
  await deliverInquiryHttp({
    subject: type === "contact" && payload.subject ? `New Contact Us message: ${payload.subject}` : `New ${type} message`,
    message: inquiryTextFromPayload(type, payload),
    replyTo: String(payload.email || ""),
    name: String(payload.name || ""),
    extra: {
      phone: String(payload.phone || ""),
      formType: type,
    },
  });
  return { ok: true, via: "backup" as const, message: "JazakAllahu Khairan. Your message has been sent to Alvasatiya Islamic Center." };
}

export async function submitInquiry(type: StoredForm["type"] | "demo", payload: Record<string, string | number>) {
  try {
    const data = await postToContactApi(type, payload);
    if (type !== "demo") saveForm(type, payload);
    return data;
  } catch (error) {
    try {
      const data = await postToInboxBackup(type, payload);
      if (type !== "demo") saveForm(type, payload);
      return data;
    } catch {
      const detail = error instanceof Error ? error.message : "Could not send your message.";
      throw new Error(`${detail} Please WhatsApp ${SITE.localPhone} or email ${SITE.email}.`);
    }
  }
}
