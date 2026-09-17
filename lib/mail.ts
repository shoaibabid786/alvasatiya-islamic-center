import nodemailer from "nodemailer";
import { SITE } from "@/data/site";

export type InquiryEmail = {
  title: string;
  fields: Record<string, string>;
  replyTo?: string;
  inbox: string;
};

const META_FIELDS = new Set(["Complete details", "Form type", "Received at"]);

const FIELD_LABELS: Record<string, string> = {
  Name: "name",
  Email: "email",
  "Phone Number": "phone",
  Subject: "subject",
  Message: "message",
  Category: "category",
  Event: "event",
  Rating: "rating",
  Course: "course",
  Country: "country",
  "Preferred date": "preferred date",
  "Preferred time": "preferred time",
  "Time zone": "time zone",
  "Payment method": "payment method",
  "Slip file": "slip file",
};

const FIELD_ORDER = [
  "Name",
  "Email",
  "Phone Number",
  "Subject",
  "Category",
  "Event",
  "Rating",
  "Course",
  "Country",
  "Preferred date",
  "Preferred time",
  "Time zone",
  "Payment method",
  "Slip file",
  "Message",
];

function env(name: string) {
  return (process.env[name] || "").trim().replace(/^['"]|['"]$/g, "");
}

function smtpUser() {
  return env("SMTP_USER") || env("CONTACT_EMAIL") || env("EMAIL_USER") || SITE.email;
}

function smtpPass() {
  return (env("SMTP_PASS") || env("GMAIL_APP_PASSWORD") || env("EMAIL_PASS")).replace(/\s+/g, "");
}

function smtpHost() {
  const host = env("SMTP_HOST");
  if (!host || host.includes("@")) return "smtp.gmail.com";
  return host;
}

function smtpConfigured() {
  return Boolean(smtpUser() && smtpPass());
}

export function isMailConfigured() {
  return smtpConfigured() || Boolean(inboxEmail());
}

export function isSmtpConfigured() {
  return smtpConfigured();
}

export function inboxEmail() {
  return env("CONTACT_EMAIL") || env("SMTP_USER") || SITE.email;
}

function fromAddress() {
  const user = smtpUser();
  return user ? `Alvasatiya Islamic Center <${user}>` : env("MAIL_FROM") || `Alvasatiya Islamic Center <${inboxEmail()}>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isFilled(value: string) {
  const text = value.trim();
  return Boolean(text) && text !== "Not provided";
}

function fieldLabel(key: string) {
  return FIELD_LABELS[key] || key.toLowerCase();
}

export function formatUserResponse(fields: Record<string, string>) {
  const seen = new Set<string>();
  const lines: string[] = [];

  const add = (key: string) => {
    if (seen.has(key) || META_FIELDS.has(key)) return;
    const value = fields[key];
    if (value === undefined || !isFilled(value)) return;
    seen.add(key);
    lines.push(`${fieldLabel(key)}: ${value.trim()}`);
  };

  for (const key of FIELD_ORDER) add(key);
  for (const key of Object.keys(fields)) add(key);

  return ["User response:", "", ...lines].join("\n");
}

function getTransporter(port: number) {
  const user = smtpUser();
  const pass = smtpPass();
  const host = smtpHost();
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
    family: 4,
    tls: { minVersion: "TLSv1.2" },
  });
}

async function sendViaSmtp(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  const preferred = Number(env("SMTP_PORT") || (process.env.VERCEL ? 465 : 587));
  const ports = preferred === 465 ? [465, 587] : [587, 465];
  let lastError = "Could not send email.";
  for (const port of ports) {
    try {
      await getTransporter(port).sendMail({
        from: fromAddress(),
        to: input.to,
        replyTo: input.replyTo,
        subject: input.subject,
        text: input.text,
        html: input.html || input.text.replace(/\n/g, "<br/>"),
      });
      return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }
  throw new Error(lastError);
}

async function sendViaHttp(input: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(input.to)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: input.subject,
      _template: "box",
      _captcha: "false",
      email: input.replyTo || input.to,
      message: input.text,
    }),
  });
  const data = (await response.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  if (!response.ok || data.success === "false" || data.success === false) {
    throw new Error(data.message || "The live server could not deliver this message.");
  }
}

export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  let smtpError = "";
  if (smtpConfigured()) {
    try {
      await sendViaSmtp(input);
      return;
    } catch (error) {
      smtpError = error instanceof Error ? error.message : "SMTP failed.";
      if (/invalid login|username and password|badcredentials|eauth|535/i.test(smtpError)) {
        smtpError = `Gmail rejected login for ${smtpUser()}. On Vercel add SMTP_USER and SMTP_PASS (16-character App Password) in Project Settings → Environment Variables, then Redeploy.`;
      }
    }
  }
  try {
    await sendViaHttp(input);
  } catch (error) {
    const httpError = error instanceof Error ? error.message : "HTTP email failed.";
    throw new Error(
      smtpError
        ? `${smtpError} Backup send also failed: ${httpError}`
        : `Live email is not configured. Add SMTP_USER and SMTP_PASS in Vercel environment variables, then Redeploy. (${httpError})`,
    );
  }
}

export async function notifyInbox(input: InquiryEmail) {
  const to = input.inbox || inboxEmail();
  const text = formatUserResponse(input.fields);
  const html = `
    <div style="font-family:Georgia,serif;font-size:16px;line-height:1.75;color:#111827;max-width:640px">
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(text)}</p>
    </div>
  `;
  await sendMail({ to, subject: input.title, text, html, replyTo: input.replyTo });
}
