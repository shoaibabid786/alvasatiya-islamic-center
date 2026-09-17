import nodemailer from "nodemailer";
import { SITE } from "@/data/site";
import { deliverInquiryHttp } from "@/lib/contact-http";

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
  return smtpConfigured();
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
    connectionTimeout: 6000,
    greetingTimeout: 6000,
    socketTimeout: 10000,
    tls: { minVersion: "TLSv1.2", servername: host },
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

export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  if (!smtpConfigured()) {
    throw new Error("Email is not configured. Add SMTP_USER and SMTP_PASS (Gmail App Password) in Vercel Environment Variables, then Redeploy.");
  }
  try {
    await sendViaSmtp(input);
  } catch (error) {
    const raw = error instanceof Error ? error.message : "Could not send email.";
    if (/invalid login|username and password|badcredentials|eauth|535/i.test(raw)) {
      throw new Error(
        `Gmail rejected login for ${smtpUser()}. On Vercel add SMTP_USER and SMTP_PASS (16-character App Password) in Project Settings → Environment Variables, then Redeploy.`,
      );
    }
    throw new Error(raw);
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
  const onVercel = Boolean(process.env.VERCEL);
  if (smtpConfigured() && !onVercel) {
    await sendViaSmtp({ to, subject: input.title, text, html, replyTo: input.replyTo });
    return;
  }
  try {
    await deliverInquiryHttp({
      subject: input.title,
      message: input.fields.Message || text,
      replyTo: input.replyTo,
      name: input.fields.Name,
      fields: input.fields,
    });
  } catch (httpError) {
    if (!smtpConfigured()) throw httpError;
    await sendViaSmtp({ to, subject: input.title, text, html, replyTo: input.replyTo });
  }
}
