import { SITE } from "@/data/site";

/** FormSubmit hash from the activation email for https://alvasatiya.org */
const FORMSUBMIT_ID = "f9d99dba87beb26996c79d2ab31548da";

export function publicInboxEmail() {
  return SITE.email;
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function formSubmitUrl(kind: "ajax" | "form") {
  const id = (process.env.NEXT_PUBLIC_FORMSUBMIT_ID || FORMSUBMIT_ID).trim();
  return kind === "ajax" ? `https://formsubmit.co/ajax/${id}` : `https://formsubmit.co/${id}`;
}

function filled(value: unknown) {
  const text = String(value ?? "").trim();
  if (!text || text === "Not provided") return "";
  return text;
}

export async function deliverInquiryHttp(input: {
  subject: string;
  message: string;
  replyTo?: string;
  name?: string;
  extra?: Record<string, string>;
  fields?: Record<string, string>;
}) {
  const payload: Record<string, string> = {
    _subject: input.subject || "New website message",
    _template: "table",
    _captcha: "false",
  };

  const visitorName = filled(input.fields?.Name) || filled(input.name) || "Website visitor";
  const visitorEmail = filled(input.fields?.Email) || filled(input.replyTo);
  const visitorPhone = filled(input.fields?.["Phone Number"]) || filled(input.fields?.Phone) || filled(input.extra?.phone);
  const visitorSubject = filled(input.fields?.Subject) || filled(input.extra?.subject);
  const visitorMessage =
    filled(input.fields?.Message) ||
    filled(input.extra?.message) ||
    filled(input.message);

  payload.name = visitorName;
  payload.Name = visitorName;
  if (visitorEmail) {
    payload.email = visitorEmail;
    payload.Email = visitorEmail;
    payload._replyto = visitorEmail;
  }
  if (visitorPhone) payload.Phone = visitorPhone;
  if (visitorSubject) payload.Subject = visitorSubject;
  payload.message = visitorMessage || input.message;
  payload.Message = payload.message;

  if (input.fields) {
    for (const [key, value] of Object.entries(input.fields)) {
      const text = filled(value);
      if (!text) continue;
      if (["Name", "Email", "Message", "Phone Number", "Subject"].includes(key)) continue;
      payload[key] = text;
    }
  }
  if (input.extra) {
    for (const [key, value] of Object.entries(input.extra)) {
      const text = filled(value);
      if (!text || key === "phone" || key === "message" || key === "subject") continue;
      if (payload[key]) continue;
      payload[key] = text;
    }
  }

  const ajax = await fetch(formSubmitUrl("ajax"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const ajaxData = asRecord(await ajax.json().catch(() => ({})));
  const ajaxMessage = String(ajaxData.message || "");
  if (ajax.ok && ajaxData.success !== false && ajaxData.success !== "false") return;
  if (/activat/i.test(ajaxMessage)) return;

  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) body.set(key, value);
  const fallback = await fetch(formSubmitUrl("form"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
    redirect: "follow",
  });
  if (fallback.ok) return;

  throw new Error(ajaxMessage || "The live server could not deliver this message to email.");
}

export function inquiryTextFromPayload(type: string, payload: Record<string, string | number>) {
  const lines = [
    `Form type: ${type}`,
    `Received at: ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}`,
  ];
  for (const [key, value] of Object.entries(payload)) {
    if (key === "website" || key === "company" || key === "type") continue;
    const text = String(value ?? "").trim();
    if (!text) continue;
    lines.push(`${key}: ${text}`);
  }
  return ["User response:", "", ...lines].join("\n");
}
