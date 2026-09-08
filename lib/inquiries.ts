import { inboxEmail, isMailConfigured, notifyInbox, type InquiryEmail } from "@/lib/mail";

export const INQUIRY_TYPES = ["contact", "feedback", "fatwa", "donate", "enroll", "event", "demo"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

const SUBJECTS: Record<InquiryType, string> = {
  contact: "New Contact Us message",
  feedback: "New website feedback",
  fatwa: "New Fatwa / Q&A question",
  donate: "New donation slip uploaded",
  enroll: "New course enrollment inquiry",
  event: "New event registration",
  demo: "New free demo request",
};

const SKIP = new Set(["type", "website", "company"]);

function asText(value: unknown, max = 8000) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, max);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function show(value: string) {
  return value || "Not provided";
}

export function buildInquiryEmail(type: InquiryType, payload: Record<string, unknown>): InquiryEmail | null {
  if (asText(payload.website || payload.company, 80)) return null;

  const name = asText(payload.name, 120);
  const email = asText(payload.email, 160);
  const phone = asText(payload.phone, 80);
  const subject = asText(payload.subject, 200);
  const message = asText(payload.message || payload.question, 8000);
  const title = asText(payload.title, 200);

  if ((type === "contact" || type === "feedback" || type === "fatwa" || type === "demo") && (!name || !email || !isEmail(email))) {
    throw new Error("Please enter your name and a valid email.");
  }
  if (type === "contact" && (!subject || !message)) {
    throw new Error("Please enter a subject and message.");
  }
  if ((type === "feedback" || type === "fatwa") && !message) {
    throw new Error("Please enter your message.");
  }
  if (type === "event" && !title) {
    throw new Error("Please choose an event.");
  }

  const fields: Record<string, string> = {
    "Form type": type,
    "Received at": new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
    Name: show(name),
    Email: show(email),
    "Phone Number": show(phone),
    Subject: show(subject),
    Category: show(asText(payload.category, 80)),
    Event: show(title),
    Rating: show(asText(payload.rating, 8)),
    Course: show(asText(payload.courseSlug, 120)),
    Country: show(asText(payload.country, 80)),
    "Preferred date": show(asText(payload.preferredDate, 40)),
    "Preferred time": show(asText(payload.preferredTime, 40)),
    "Time zone": show(asText(payload.timeZone, 80)),
    "Payment method": show(asText(payload.method, 80)),
    "Slip file": show(asText(payload.slip, 160)),
    Message: show(message),
  };

  if (type !== "contact") delete fields.Subject;
  if (type !== "feedback" && type !== "fatwa" && type !== "donate") delete fields.Category;
  if (type !== "event") delete fields.Event;
  if (type !== "feedback") delete fields.Rating;
  if (type !== "demo") {
    delete fields.Course;
    delete fields.Country;
    delete fields["Preferred date"];
    delete fields["Preferred time"];
    delete fields["Time zone"];
  }
  if (type !== "donate") {
    delete fields["Payment method"];
    delete fields["Slip file"];
  }

  for (const [key, value] of Object.entries(payload)) {
    if (SKIP.has(key)) continue;
    const text = asText(value, 8000);
    if (!text) continue;
    const known = ["name", "email", "phone", "subject", "message", "question", "category", "title", "rating", "courseSlug", "country", "preferredDate", "preferredTime", "timeZone", "method", "slip"];
    if (known.includes(key)) continue;
    fields[key] = text;
  }

  fields["Complete details"] = [
    `Name: ${show(name)}`,
    `Email: ${show(email)}`,
    `Phone Number: ${show(phone)}`,
    subject ? `Subject: ${subject}` : "",
    title ? `Event: ${title}` : "",
    "",
    "Message:",
    message || "Not provided",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return {
    title: subject && type === "contact" ? `${SUBJECTS.contact}: ${subject}` : SUBJECTS[type],
    fields,
    replyTo: isEmail(email) ? email : undefined,
    inbox: inboxEmail(),
  };
}

export async function sendInquiryEmail(type: InquiryType, payload: Record<string, unknown>, mode: "send" | "prepare" = "send") {
  const email = buildInquiryEmail(type, payload);
  if (!email) return { via: "ignored" as const, title: "", fields: {}, inbox: inboxEmail() };
  if (mode === "prepare" && !isMailConfigured()) {
    return { ...email, via: "client" as const };
  }
  await notifyInbox(email);
  return { ...email, via: "server" as const };
}
