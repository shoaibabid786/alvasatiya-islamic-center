import nodemailer from "nodemailer";
import { SITE } from "@/data/site";

export type InquiryEmail = {
  title: string;
  fields: Record<string, string>;
  replyTo?: string;
  inbox: string;
};

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function isMailConfigured() {
  return smtpConfigured();
}

export function inboxEmail() {
  return (process.env.CONTACT_EMAIL || SITE.email).trim();
}

function fromAddress() {
  return process.env.MAIL_FROM || process.env.SMTP_USER || `Alvasatiya Islamic Center <${inboxEmail()}>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  if (!smtpConfigured()) {
    throw new Error("Email is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.");
  }
  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: fromAddress(),
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
    html: input.html || input.text.replace(/\n/g, "<br/>"),
  });
}

export async function notifyInbox(input: InquiryEmail) {
  const to = input.inbox || inboxEmail();
  const rows = Object.entries(input.fields);
  const text = [`${input.title}`, "", ...rows.map(([label, value]) => `${label}:\n${value}\n`), `Inbox: ${to}`].join("\n");
  const html = `
    <div style="font-family:Georgia,serif;max-width:640px;color:#14532d">
      <p style="margin:0 0 8px;letter-spacing:.12em;text-transform:uppercase;color:#b45309;font-size:12px">Alvasatiya Islamic Center</p>
      <h2 style="margin:0 0 16px">${escapeHtml(input.title)}</h2>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;width:170px;vertical-align:top;font-weight:600">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`
          )
          .join("")}
      </table>
      <p style="margin-top:16px;color:#4b5563;font-size:13px">Reply to this email to answer the sender directly.</p>
    </div>
  `;

  if (smtpConfigured()) {
    await sendMail({ to, subject: input.title, text, html, replyTo: input.replyTo });
    return;
  }

  await sendViaFormSubmit(to, input.title, input.fields, input.replyTo);
}

export async function sendViaFormSubmit(to: string, subject: string, fields: Record<string, string>, replyTo?: string) {
  const origin = typeof window === "undefined" ? process.env.NEXT_PUBLIC_APP_URL || SITE.url : window.location.origin;
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: origin,
      Referer: `${origin}/contact`,
    },
    body: JSON.stringify({
      _subject: subject,
      _template: "box",
      _captcha: "false",
      ...(replyTo ? { _replyto: replyTo } : {}),
      ...fields,
    }),
  });
  const data = (await response.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  const message = data.message || "";
  if (/activat/i.test(message)) return;
  if (!response.ok || data.success === "false" || data.success === false) {
    throw new Error(message || `Could not deliver the message to ${to}.`);
  }
}
