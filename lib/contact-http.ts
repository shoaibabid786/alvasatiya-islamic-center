import { SITE } from "@/data/site";

export function publicInboxEmail() {
  return SITE.email;
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export async function deliverInquiryHttp(input: {
  subject: string;
  message: string;
  replyTo?: string;
  name?: string;
  extra?: Record<string, string>;
}) {
  const inbox = publicInboxEmail();
  const payload: Record<string, string> = {
    _subject: input.subject,
    _template: "box",
    _captcha: "false",
    name: (input.name || "Website visitor").trim() || "Website visitor",
    email: (input.replyTo || inbox).trim() || inbox,
    message: input.message,
    ...input.extra,
  };

  const ajax = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(inbox)}`, {
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
  const fallback = await fetch(`https://formsubmit.co/${encodeURIComponent(inbox)}`, {
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
