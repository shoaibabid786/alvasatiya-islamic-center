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
  return (process.env[name] || "").trim();
}

function smtpUser() {
  return env("SMTP_USER") || env("CONTACT_EMAIL");
}

function smtpPass() {
  return env("SMTP_PASS").replace(/\s+/g, "");
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

export function inboxEmail() {
  return env("CONTACT_EMAIL") || SITE.email;
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

function getTransporter() {
  if (!smtpConfigured()) {
    throw new Error("Email is not configured. Add SMTP_USER and SMTP_PASS (Gmail App Password) in .env, then restart npm run dev.");
  }
  const user = smtpUser();
  const pass = smtpPass();
  const port = Number(env("SMTP_PORT") || 587);
  const host = smtpHost();
  if (host === "smtp.gmail.com") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
  });
}

export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  const transporter = getTransporter();
  try {
    await transporter.sendMail({
      from: fromAddress(),
      to: input.to,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text,
      html: input.html || input.text.replace(/\n/g, "<br/>"),
    });
  } catch (error) {
    const raw = error instanceof Error ? error.message : "Could not send email.";
    if (/invalid login|username and password|badcredentials|eauth|535/i.test(raw)) {
      throw new Error(
        `Gmail rejected login for ${smtpUser()}. Sign into that same Gmail, turn on 2-Step Verification, create a new App Password (Security → 2-Step Verification → App passwords), and paste the 16-character code here.`,
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
  await sendMail({ to, subject: input.title, text, html, replyTo: input.replyTo });
}
