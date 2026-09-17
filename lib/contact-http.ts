import { SITE } from "@/data/site";

/** FormSubmit hash from the activation email for https://alvasatiya.org */
const FORMSUBMIT_ID = "f9d99dba87beb26996c79d2ab31548da";

export function publicInboxEmail() {
  return SITE.email;
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export function formSubmitActionUrl() {
  const id = (process.env.NEXT_PUBLIC_FORMSUBMIT_ID || FORMSUBMIT_ID).trim();
  return `https://formsubmit.co/${id}`;
}

function filled(value: unknown) {
  return String(value ?? "").trim();
}

export function formatContactDetails(input: {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  extra?: Record<string, string>;
}) {
  const lines = [
    `Name: ${filled(input.name) || "Not provided"}`,
    `Email: ${filled(input.email) || "Not provided"}`,
    `Phone: ${filled(input.phone) || "Not provided"}`,
    `Subject: ${filled(input.subject) || "Not provided"}`,
    "",
    "Message:",
    filled(input.message) || "Not provided",
  ];
  if (input.extra) {
    for (const [key, value] of Object.entries(input.extra)) {
      const text = filled(value);
      if (!text) continue;
      lines.push(`${key}: ${text}`);
    }
  }
  return lines.join("\n");
}

function simplePayload(input: {
  subject: string;
  name?: string;
  email?: string;
  phone?: string;
  visitorSubject?: string;
  message: string;
}) {
  const details = formatContactDetails({
    name: input.name,
    email: input.email,
    phone: input.phone,
    subject: input.visitorSubject,
    message: input.message,
  });
  return {
    _subject: input.subject || "New Contact Us message",
    _captcha: "false",
    name: filled(input.name) || "Website visitor",
    email: filled(input.email),
    phone: filled(input.phone),
    subject: filled(input.visitorSubject),
    message: details,
  };
}

export async function deliverInquiryHttp(input: {
  subject: string;
  message: string;
  replyTo?: string;
  name?: string;
  extra?: Record<string, string>;
  fields?: Record<string, string>;
}) {
  const payload = simplePayload({
    subject: input.subject,
    name: filled(input.fields?.Name) || filled(input.name),
    email: filled(input.fields?.Email) || filled(input.replyTo),
    phone: filled(input.fields?.["Phone Number"]) || filled(input.fields?.Phone) || filled(input.extra?.phone),
    visitorSubject: filled(input.fields?.Subject) || filled(input.extra?.subject),
    message: filled(input.fields?.Message) || filled(input.extra?.message) || filled(input.message),
  });

  const encoded = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    if (value) encoded.set(key, value);
  }

  const ajax = await fetch(`${formSubmitActionUrl()}`.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: encoded.toString(),
  });
  const ajaxData = asRecord(await ajax.json().catch(() => ({})));
  const ajaxMessage = String(ajaxData.message || "");
  if (ajax.ok && ajaxData.success !== false && ajaxData.success !== "false") return;
  if (/activat/i.test(ajaxMessage)) return;

  const fallback = await fetch(formSubmitActionUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: encoded.toString(),
    redirect: "follow",
  });
  if (fallback.ok) return;

  throw new Error(ajaxMessage || "The live server could not deliver this message to email.");
}
