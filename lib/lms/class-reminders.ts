import { prisma } from "@/lib/prisma";
import { isMailConfigured, sendMail } from "@/lib/mail";

const REMIND_BEFORE_MS = 5 * 60 * 1000;

function asDate(value: unknown) {
  const date = value instanceof Date ? value : new Date(String(value || ""));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatClassTime(date: Date) {
  return date.toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

async function recipientsFor(meeting: any) {
  const members = await prisma.classMember.findMany({
    where: { classId: meeting.classId },
    include: { student: true },
  });
  const byEmail = new Map<string, { name: string; email: string }>();
  for (const member of members) {
    const student = member.student;
    if (!student?.email || student.role !== "STUDENT") continue;
    byEmail.set(String(student.email).trim().toLowerCase(), {
      name: student.name,
      email: String(student.email).trim().toLowerCase(),
    });
  }
  const extras = Array.isArray(meeting.studentEmails) ? meeting.studentEmails : [];
  if (extras.length) {
    const extraStudents = await prisma.user.findMany({
      where: { role: "STUDENT", email: { in: extras.map((email: string) => String(email).trim().toLowerCase()) } },
    });
    for (const student of extraStudents) {
      byEmail.set(String(student.email).trim().toLowerCase(), {
        name: student.name,
        email: String(student.email).trim().toLowerCase(),
      });
    }
  }
  return [...byEmail.values()];
}

export async function sendDueClassReminders() {
  if (!isMailConfigured()) {
    return { sent: 0, skipped: "Email is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS." };
  }

  const now = Date.now();
  const meetings = await prisma.liveMeeting.findMany({
    where: { status: "SCHEDULED" },
    include: { class: true },
  });

  let sent = 0;
  const errors: string[] = [];

  for (const meeting of meetings) {
    if (meeting.remindByEmail === false) continue;
    if (meeting.reminderSentAt) continue;
    const startsAt = asDate(meeting.startsAt);
    if (!startsAt) continue;
    const remaining = startsAt.getTime() - now;
    if (remaining <= 0 || remaining > REMIND_BEFORE_MS) continue;

    const students = await recipientsFor(meeting);
    if (!students.length) continue;

    // Mark first so overlapping dashboard pings do not send the same mail twice.
    await prisma.liveMeeting.update({
      where: { id: meeting.id },
      data: { reminderSentAt: new Date() },
    });

    const className = meeting.class?.name || "your class";
    const startLabel = formatClassTime(startsAt);

    for (const student of students) {
      const text = [
        `Assalamu alaikum ${student.name},`,
        "",
        `After 5 minutes your class will start.`,
        "",
        `Class: ${meeting.title}`,
        `Course: ${className}`,
        `Class starts at: ${startLabel}`,
        meeting.meetingUrl ? `Join link: ${meeting.meetingUrl}` : "",
        "",
        "Please open Join class in your student dashboard, or use the link above.",
        "",
        "Alvasatiya Islamic Center",
      ]
        .filter(Boolean)
        .join("\n");

      try {
        await sendMail({
          to: student.email,
          subject: `Class starts in 5 minutes: ${meeting.title}`,
          text,
        });
        sent += 1;
      } catch (error) {
        errors.push(`${student.email}: ${error instanceof Error ? error.message : "send failed"}`);
      }
    }
  }

  return { sent, errors };
}
