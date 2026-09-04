"use client";

import { useEffect, useState } from "react";
import { api, useToast } from "@/components/lms/toast";
import { EmptyState, LoadingState } from "@/components/lms/ui";

type Meeting = {
  id: string;
  title: string;
  meetingUrl: string;
  startsAt: string;
  class?: { name: string; subject: string; teacher?: { name: string } | null } | null;
};

export default function JoinClassView({ forTeacher = false }: { forTeacher?: boolean }) {
  const { push } = useToast();
  const [meetings, setMeetings] = useState<Meeting[] | null>(null);

  useEffect(() => {
    api<{ meetings: Meeting[] }>("/api/live-meetings")
      .then((data) => setMeetings(data.meetings))
      .catch((err) => {
        push(err.message, "error");
        setMeetings([]);
      });
  }, [push]);

  if (!meetings) return <LoadingState />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">{forTeacher ? "Take class" : "Join class"}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {forTeacher
            ? "Open the live session the administrator scheduled. You cannot create the class link."
            : "Open the live class your administrator scheduled for you."}
        </p>
      </div>
      {meetings.length === 0 ? (
        <EmptyState
          title="No live class yet"
          body={forTeacher ? "When an administrator schedules one of your classes, Take class will appear here." : "When an administrator schedules a class you belong to, a Join class button will appear here."}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {meetings.map((meeting) => (
            <article key={meeting.id} className="lms-card flex flex-col justify-between p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-teal-700">{meeting.class?.subject || "Class"}</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-800">{meeting.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{meeting.class?.name}</p>
                {meeting.class?.teacher?.name ? (
                  <p className="text-sm text-slate-500">{meeting.class.teacher.name}</p>
                ) : null}
                <p className="mt-3 text-sm font-medium text-slate-700">{new Date(meeting.startsAt).toLocaleString()}</p>
              </div>
              <a
                className="lms-btn lms-btn-primary mt-5 w-full justify-center"
                href={meeting.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {forTeacher ? "Take class" : "Join class"}
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
