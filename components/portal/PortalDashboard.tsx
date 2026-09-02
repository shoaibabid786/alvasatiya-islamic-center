"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

type Role = "ADMIN" | "TEACHER" | "STUDENT";
type Snapshot = {
  role: Role;
  user: { id: string; name: string; email: string; role: Role; status: string };
  access?: boolean;
  courses: Array<{ slug: string; title: string; category: string; duration: string; language: string; level: string }>;
  users: Array<{ id: string; name: string; email: string; role: Role; status: string }>;
  demos: Array<{ id: string; name: string; email: string; phone: string; country: string; courseSlug: string; preferredDate: string; preferredTime: string; timeZone: string; message: string; status: string; scheduledAt?: string }>;
  enrollments: Array<{ id: string; userId: string; courseSlug: string; status: string; teacherId?: string }>;
  payments: Array<{ id: string; courseSlug: string; status: string; amountLabel: string }>;
  classes: Array<{ id: string; courseSlug: string; title: string; startsAt: string; durationMin: number; joinUrl: string; status: string }>;
  assignments: Array<{ id: string; courseSlug: string; title: string; instructions: string; dueAt: string }>;
  submissions: Array<{ id: string; assignmentId: string; studentId: string; content: string; grade?: string; feedback?: string }>;
  quizzes: Array<{ id: string; courseSlug: string; title: string; questions: Array<{ q: string; options: string[] }> }>;
  attempts: Array<{ id: string; quizId: string; studentId: string; score: number }>;
  attendance: Array<{ id: string; classId: string; studentId: string; present: boolean }>;
  certificates: Array<{ id: string; studentId: string; courseSlug: string; title: string; issuedAt: string }>;
  feedback: Array<{ id: string; message: string; courseSlug?: string; createdAt: string }>;
  announcements: Array<{ id: string; title: string; body: string; audience: string }>;
  institutions?: Array<{
    slug: string;
    kind: string;
    title: string;
    location: string;
    summary: string;
    students: number | null;
    programs: Array<{ id: string; label: string; students: number | null }>;
  }>;
};

const ADMIN_NAV = ["Overview", "Students", "Teachers", "Courses", "Institutions", "Demo Requests", "Enrollments", "Payments", "Classes", "Assignments", "Quizzes", "Attendance", "Certificates", "Feedback", "Announcements"];
const TEACHER_NAV = ["Overview", "Courses", "Students", "Classes", "Assignments", "Quizzes", "Attendance", "Progress", "Feedback"];
const STUDENT_NAV = ["Dashboard", "My Courses", "Upcoming Class", "Live Class", "Assignments", "Quizzes", "Results", "Attendance", "Progress", "Resources", "Certificates", "Notifications"];

export default function PortalDashboard({ expected }: { expected: Role }) {
  const router = useRouter();
  const [data, setData] = useState<Snapshot | null>(null);
  const [error, setError] = useState("");
  const [view, setView] = useState(expected === "STUDENT" ? "Dashboard" : "Overview");
  const [open, setOpen] = useState(false);

  async function load() {
    const response = await fetch("/api/lms");
    const json = await response.json();
    if (!response.ok) {
      setError(json.error || "Please sign in.");
      return;
    }
    if (json.role !== expected) {
      router.replace(`/portal/${json.role.toLowerCase()}`);
      return;
    }
    setData(json);
  }

  useEffect(() => {
    load().catch(() => setError("Could not load portal."));
  }, [expected]);

  const nav = expected === "ADMIN" ? ADMIN_NAV : expected === "TEACHER" ? TEACHER_NAV : STUDENT_NAV;
  const title = expected === "ADMIN" ? "Admin Portal" : expected === "TEACHER" ? "Teacher Portal" : "Student Portal";

  if (error) {
    return (
      <div className="section-container py-12">
        <p className="text-muted">{error}</p>
        <Link href="/login" className="btn btn-gold mt-4">Login</Link>
      </div>
    );
  }
  if (!data) return <div className="section-container py-12 text-muted">Loading portal...</div>;

  if (expected === "STUDENT" && !data.access) {
    return (
      <div className="section-container py-12 max-w-2xl">
        <h1 className="section-title">Student Portal</h1>
        <p className="mt-4 text-muted">
          This portal unlocks after an approved, verified enrollment. Discover a course, book a demo if you wish, enroll, and complete payment. Access stays inactive until the server verifies payment.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/courses" className="btn btn-gold">Browse courses</Link>
          <button className="btn btn-outline" onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => router.push("/"))}>Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-[70vh]">
      <div className="section-container py-6 md:py-10 grid lg:grid-cols-[240px_1fr] gap-6">
        <button className="lg:hidden btn btn-outline w-max" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          Menu
        </button>
        <aside className={`${open ? "block" : "hidden"} lg:block card-surface p-4 h-max`}>
          <p className="text-xs uppercase tracking-widest text-gold">{title}</p>
          <p className="mt-1 font-semibold text-green-deep">{data.user.name}</p>
          <nav className="mt-4 grid gap-1">
            {nav.map((item) => (
              <button
                key={item}
                className={`text-left px-3 py-2 rounded-xl text-sm ${view === item ? "bg-sage text-green-deep font-semibold" : "text-muted hover:bg-sage/60"}`}
                onClick={() => {
                  setView(item);
                  setOpen(false);
                }}
              >
                {item}
              </button>
            ))}
          </nav>
          <button
            className="btn btn-outline w-full mt-4 !py-2"
            onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => router.push("/"))}
          >
            Sign out
          </button>
        </aside>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-green-deep">{view}</h1>
          <div className="mt-5">
            {expected === "ADMIN" && <AdminViews view={view} data={data} reload={load} />}
            {expected === "TEACHER" && <TeacherViews view={view} data={data} reload={load} />}
            {expected === "STUDENT" && <StudentViews view={view} data={data} reload={load} />}
          </div>
        </div>
      </div>
    </div>
  );
}

async function act(action: string, payload: Record<string, unknown> = {}) {
  const response = await fetch("/api/lms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Action failed.");
  return data;
}

function CardList({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3">{children}</div>;
}

function AdminViews({ view, data, reload }: { view: string; data: Snapshot; reload: () => Promise<void> }) {
  const students = data.users.filter((u) => u.role === "STUDENT");
  const teachers = data.users.filter((u) => u.role === "TEACHER");
  if (view === "Overview") {
    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Students" value={students.length} />
        <Stat label="Teachers" value={teachers.length} />
        <Stat label="Courses" value={data.courses.length} />
        <Stat label="Demo requests" value={data.demos.length} />
      </div>
    );
  }
  if (view === "Students") {
    return (
      <CardList>
        {students.map((user) => (
          <article key={user.id} className="card-surface p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-green-deep">{user.name}</p>
              <p className="text-sm text-muted">{user.email} · {user.status}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-green !py-2" onClick={() => act("updateUser", { id: user.id, status: "active" }).then(reload)}>Activate</button>
              <button className="btn btn-outline !py-2" onClick={() => act("updateUser", { id: user.id, status: "suspended" }).then(reload)}>Suspend</button>
            </div>
          </article>
        ))}
      </CardList>
    );
  }
  if (view === "Teachers") {
    return (
      <div className="space-y-6">
        <TeacherCreate onDone={reload} />
        <CardList>
          {teachers.map((user) => (
            <article key={user.id} className="card-surface p-4">
              <p className="font-semibold text-green-deep">{user.name}</p>
              <p className="text-sm text-muted">{user.email} · {user.status}</p>
            </article>
          ))}
        </CardList>
      </div>
    );
  }
  if (view === "Courses") return <CourseManager courses={data.courses} onDone={reload} />;
  if (view === "Institutions") return <InstitutionManager items={data.institutions ?? []} onDone={reload} />;
  if (view === "Demo Requests") {
    return (
      <CardList>
        {data.demos.map((demo) => (
          <article key={demo.id} className="card-surface p-4">
            <p className="font-semibold text-green-deep">{demo.name} · {demo.courseSlug}</p>
            <p className="text-sm text-muted">{demo.email} · {demo.phone} · {demo.country}</p>
            <p className="text-sm text-muted">{demo.preferredDate} {demo.preferredTime} ({demo.timeZone})</p>
            <p className="text-sm mt-1">{demo.message}</p>
            <p className="text-xs uppercase tracking-widest text-gold mt-2">{demo.status}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn btn-green !py-2" onClick={() => act("updateDemo", { id: demo.id, status: "approved" }).then(reload)}>Approve</button>
              <button className="btn btn-outline !py-2" onClick={() => act("updateDemo", { id: demo.id, status: "rejected" }).then(reload)}>Reject</button>
              <button className="btn btn-gold !py-2" onClick={() => act("updateDemo", { id: demo.id, status: "scheduled", scheduledAt: demo.preferredDate }).then(reload)}>Schedule</button>
            </div>
          </article>
        ))}
        {data.demos.length === 0 && <p className="text-muted">No demo requests yet.</p>}
      </CardList>
    );
  }
  if (view === "Enrollments") {
    return (
      <CardList>
        {data.enrollments.map((item) => (
          <article key={item.id} className="card-surface p-4">
            <p className="font-semibold text-green-deep">{item.courseSlug} · {item.status}</p>
            <p className="text-sm text-muted">Student: {data.users.find((u) => u.id === item.userId)?.name || item.userId}</p>
            <label className="block text-sm mt-2">
              Assign teacher
              <select
                className="mt-1"
                defaultValue={item.teacherId || ""}
                onChange={(e) => act("assignTeacher", { enrollmentId: item.id, teacherId: e.target.value }).then(reload)}
              >
                <option value="">Select</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </label>
          </article>
        ))}
      </CardList>
    );
  }
  if (view === "Payments") {
    return (
      <CardList>
        {data.payments.map((item) => (
          <article key={item.id} className="card-surface p-4">
            <p className="font-semibold text-green-deep">{item.courseSlug}</p>
            <p className="text-sm text-muted">{item.amountLabel}</p>
            <p className="text-xs uppercase tracking-widest text-gold mt-1">{item.status}</p>
          </article>
        ))}
      </CardList>
    );
  }
  if (view === "Certificates") {
    return (
      <div className="space-y-4">
        <IssueCert enrollments={data.enrollments} onDone={reload} />
        <CardList>
          {data.certificates.map((item) => (
            <article key={item.id} className="card-surface p-4">
              <p className="font-semibold text-green-deep">{item.title}</p>
              <p className="text-sm text-muted">{item.issuedAt.slice(0, 10)}</p>
            </article>
          ))}
        </CardList>
      </div>
    );
  }
  if (view === "Announcements") return <AnnounceForm onDone={reload} items={data.announcements} />;
  if (view === "Feedback") {
    return (
      <CardList>
        {data.feedback.map((item) => (
          <article key={item.id} className="card-surface p-4">
            <p className="text-sm text-muted">{item.createdAt.slice(0, 10)} · {item.courseSlug || "General"}</p>
            <p className="mt-1">{item.message}</p>
          </article>
        ))}
      </CardList>
    );
  }
  return <SharedLearning view={view} data={data} reload={reload} asTeacher />;
}

function TeacherViews({ view, data, reload }: { view: string; data: Snapshot; reload: () => Promise<void> }) {
  if (view === "Overview") {
    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Assigned courses" value={data.courses.length} />
        <Stat label="Students" value={data.users.filter((u) => u.role === "STUDENT").length} />
        <Stat label="Classes" value={data.classes.length} />
        <Stat label="Assignments" value={data.assignments.length} />
      </div>
    );
  }
  if (view === "Courses") {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {data.courses.map((course) => (
          <article key={course.slug} className="card-surface p-4">
            <h2 className="font-semibold text-green-deep">{course.title}</h2>
            <p className="text-sm text-muted">{course.category} · {course.language}</p>
          </article>
        ))}
      </div>
    );
  }
  if (view === "Students") {
    return (
      <CardList>
        {data.users.filter((u) => u.role === "STUDENT").map((user) => (
          <article key={user.id} className="card-surface p-4">
            <p className="font-semibold text-green-deep">{user.name}</p>
            <p className="text-sm text-muted">{user.email}</p>
          </article>
        ))}
      </CardList>
    );
  }
  if (view === "Progress") {
    return (
      <CardList>
        {data.attempts.map((item) => (
          <article key={item.id} className="card-surface p-4">
            <p>Quiz score: {item.score}</p>
            <p className="text-sm text-muted">Student {item.studentId}</p>
          </article>
        ))}
        {data.attempts.length === 0 && <p className="text-muted">No quiz results yet.</p>}
      </CardList>
    );
  }
  if (view === "Feedback") {
    return <FeedbackBox courses={data.courses} onDone={reload} items={data.feedback} />;
  }
  return <SharedLearning view={view} data={data} reload={reload} asTeacher />;
}

function StudentViews({ view, data, reload }: { view: string; data: Snapshot; reload: () => Promise<void> }) {
  const upcoming = useMemo(
    () => data.classes.filter((item) => item.status !== "completed").sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [data.classes]
  );
  const live = data.classes.filter((item) => item.status === "live");
  if (view === "Dashboard") {
    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="My courses" value={data.courses.length} />
        <Stat label="Upcoming classes" value={upcoming.length} />
        <Stat label="Assignments" value={data.assignments.length} />
        <Stat label="Certificates" value={data.certificates.length} />
      </div>
    );
  }
  if (view === "My Courses") {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {data.courses.map((course) => (
          <article key={course.slug} className="card-surface p-4">
            <h2 className="font-semibold text-green-deep">{course.title}</h2>
            <Link href={`/courses/${course.slug}`} className="text-sm text-teal mt-2 inline-block">Course page</Link>
          </article>
        ))}
      </div>
    );
  }
  if (view === "Upcoming Class") {
    return (
      <CardList>
        {upcoming.map((item) => (
          <article key={item.id} className="card-surface p-4">
            <p className="font-semibold text-green-deep">{item.title}</p>
            <p className="text-sm text-muted">{new Date(item.startsAt).toLocaleString()} · {item.durationMin} min</p>
          </article>
        ))}
        {upcoming.length === 0 && <p className="text-muted">No upcoming classes scheduled yet.</p>}
      </CardList>
    );
  }
  if (view === "Live Class") {
    return (
      <CardList>
        {live.map((item) => (
          <article key={item.id} className="card-surface p-4">
            <p className="font-semibold text-green-deep">{item.title}</p>
            <a href={item.joinUrl} className="btn btn-gold mt-3 !py-2" target="_blank" rel="noreferrer">Join live class</a>
          </article>
        ))}
        {live.length === 0 && <p className="text-muted">No class is live right now.</p>}
      </CardList>
    );
  }
  if (view === "Assignments") {
    return (
      <CardList>
        {data.assignments.map((item) => (
          <StudentAssignment key={item.id} assignment={item} onDone={reload} />
        ))}
      </CardList>
    );
  }
  if (view === "Quizzes") {
    return (
      <CardList>
        {data.quizzes.map((quiz) => (
          <StudentQuiz key={quiz.id} quiz={quiz} onDone={reload} />
        ))}
      </CardList>
    );
  }
  if (view === "Results") {
    return (
      <CardList>
        {data.attempts.map((item) => (
          <article key={item.id} className="card-surface p-4">Score: {item.score}</article>
        ))}
        {data.submissions.map((item) => (
          <article key={item.id} className="card-surface p-4">
            Assignment grade: {item.grade || "Pending"} {item.feedback ? `· ${item.feedback}` : ""}
          </article>
        ))}
      </CardList>
    );
  }
  if (view === "Attendance") {
    return (
      <CardList>
        {data.attendance.map((item) => (
          <article key={item.id} className="card-surface p-4">{item.present ? "Present" : "Absent"}</article>
        ))}
      </CardList>
    );
  }
  if (view === "Progress") {
    const total = data.assignments.length + data.quizzes.length;
    const done = data.submissions.length + data.attempts.length;
    return <p className="text-muted">Completed {done} of {total || 0} tracked tasks across your active courses.</p>;
  }
  if (view === "Resources") {
    return <p className="text-muted">Course resources appear here when your teacher adds assignment links or class notes.</p>;
  }
  if (view === "Certificates") {
    return (
      <CardList>
        {data.certificates.map((item) => (
          <article key={item.id} className="card-surface p-4">
            <p className="font-semibold text-green-deep">{item.title}</p>
            <p className="text-sm text-muted">Issued {item.issuedAt.slice(0, 10)}</p>
          </article>
        ))}
        {data.certificates.length === 0 && <p className="text-muted">No certificate has been issued yet.</p>}
      </CardList>
    );
  }
  if (view === "Notifications") {
    return (
      <CardList>
        {data.announcements.map((item) => (
          <article key={item.id} className="card-surface p-4">
            <p className="font-semibold text-green-deep">{item.title}</p>
            <p className="text-sm text-muted mt-1">{item.body}</p>
          </article>
        ))}
      </CardList>
    );
  }
  return null;
}

function SharedLearning({ view, data, reload, asTeacher }: { view: string; data: Snapshot; reload: () => Promise<void>; asTeacher?: boolean }) {
  if (view === "Classes") {
    return (
      <div className="space-y-6">
        {asTeacher && <ClassForm courses={data.courses} onDone={reload} />}
        <CardList>
          {data.classes.map((item) => (
            <article key={item.id} className="card-surface p-4">
              <p className="font-semibold text-green-deep">{item.title}</p>
              <p className="text-sm text-muted">{item.courseSlug} · {new Date(item.startsAt).toLocaleString()} · {item.status}</p>
              {item.joinUrl && <a className="text-sm text-teal" href={item.joinUrl} target="_blank" rel="noreferrer">Join link</a>}
            </article>
          ))}
        </CardList>
      </div>
    );
  }
  if (view === "Assignments") {
    return (
      <div className="space-y-6">
        {asTeacher && <AssignmentForm courses={data.courses} onDone={reload} />}
        {asTeacher && (
          <CardList>
            {data.submissions.map((item) => (
              <article key={item.id} className="card-surface p-4 space-y-2">
                <p>{item.content}</p>
                <GradeBox submissionId={item.id} onDone={reload} />
              </article>
            ))}
          </CardList>
        )}
        <CardList>
          {data.assignments.map((item) => (
            <article key={item.id} className="card-surface p-4">
              <p className="font-semibold text-green-deep">{item.title}</p>
              <p className="text-sm text-muted">{item.instructions}</p>
            </article>
          ))}
        </CardList>
      </div>
    );
  }
  if (view === "Quizzes") {
    return (
      <div className="space-y-6">
        {asTeacher && <QuizForm courses={data.courses} onDone={reload} />}
        <CardList>
          {data.quizzes.map((item) => (
            <article key={item.id} className="card-surface p-4">
              <p className="font-semibold text-green-deep">{item.title}</p>
              <p className="text-sm text-muted">{item.questions.length} questions</p>
            </article>
          ))}
        </CardList>
      </div>
    );
  }
  if (view === "Attendance") {
    return (
      <div className="space-y-6">
        {asTeacher && <AttendanceForm data={data} onDone={reload} />}
        <CardList>
          {data.attendance.map((item) => (
            <article key={item.id} className="card-surface p-4">{item.present ? "Present" : "Absent"} · {item.studentId}</article>
          ))}
        </CardList>
      </div>
    );
  }
  return <p className="text-muted">This area is ready for records as soon as classes begin.</p>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article className="card-surface p-5">
      <p className="text-3xl font-bold text-green-deep">{value}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </article>
  );
}

function TeacherCreate({ onDone }: { onDone: () => Promise<void> }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  return (
    <form
      className="card-surface p-4 grid md:grid-cols-4 gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        act("createTeacher", form).then(onDone);
      }}
    >
      <input required placeholder="Teacher name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input required type="password" placeholder="Temporary password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn btn-gold">Create teacher</button>
    </form>
  );
}

function CourseManager({ courses, onDone }: { courses: Snapshot["courses"]; onDone: () => Promise<void> }) {
  const [form, setForm] = useState({ title: "", category: "Quran", description: "", duration: "6 months", language: "English & Urdu", level: "Beginner" });
  return (
    <div className="space-y-6">
      <form
        className="card-surface p-4 grid md:grid-cols-2 gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          act("createCourse", form).then(onDone);
        }}
      >
        <input required placeholder="Course title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input required placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
        <input required placeholder="Language" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
        <textarea className="md:col-span-2" required placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn btn-gold">Add course</button>
      </form>
      <div className="grid md:grid-cols-2 gap-3">
        {courses.map((course) => (
          <article key={course.slug} className="card-surface p-4">
            <p className="font-semibold text-green-deep">{course.title}</p>
            <p className="text-sm text-muted">{course.category} · {course.duration} · {course.language}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function InstitutionManager({
  items,
  onDone,
}: {
  items: NonNullable<Snapshot["institutions"]>;
  onDone: () => Promise<void>;
}) {
  const editable = items.filter((item) => item.kind !== "branch-network");
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Student counts and locations update the public homepage and institution pages without a code change. Leave Branch 5 empty until a figure is confirmed. The Tehfeez network total is the sum of published branch counts.
      </p>
      {editable.map((item) => (
        <InstitutionEditCard key={item.slug} item={item} onDone={onDone} />
      ))}
    </div>
  );
}

function InstitutionEditCard({
  item,
  onDone,
}: {
  item: NonNullable<Snapshot["institutions"]>[number];
  onDone: () => Promise<void>;
}) {
  const [students, setStudents] = useState(item.students == null ? "" : String(item.students));
  const [location, setLocation] = useState(item.location);
  const [summary, setSummary] = useState(item.summary);
  const [programs, setPrograms] = useState(
    item.programs.map((program) => ({ ...program, input: program.students == null ? "" : String(program.students) }))
  );
  return (
    <form
      className="card-surface p-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        act("saveInstitution", {
          institution: {
            slug: item.slug,
            students: students.trim() === "" ? null : Number(students),
            location,
            summary,
            programs: programs.map((program) => ({
              id: program.id,
              label: program.label,
              students: program.input.trim() === "" ? null : Number(program.input),
            })),
          },
        }).then(onDone);
      }}
    >
      <p className="font-semibold text-green-deep">{item.title}</p>
      <p className="text-xs uppercase tracking-widest text-gold">{item.kind}</p>
      <input value={location} onChange={(e) => setLocation(e.target.value)} aria-label={`${item.title} location`} />
      <textarea value={summary} onChange={(e) => setSummary(e.target.value)} aria-label={`${item.title} summary`} />
      <label className="block text-sm font-semibold text-green-deep">
        Students
        <input
          className="mt-1"
          inputMode="numeric"
          placeholder="Leave blank if unpublished"
          value={students}
          onChange={(e) => setStudents(e.target.value)}
        />
      </label>
      {programs.map((program, index) => (
        <label key={program.id} className="block text-sm font-semibold text-green-deep">
          {program.label}
          <input
            className="mt-1"
            inputMode="numeric"
            value={program.input}
            onChange={(e) =>
              setPrograms((current) =>
                current.map((row, i) => (i === index ? { ...row, input: e.target.value } : row))
              )
            }
          />
        </label>
      ))}
      <button className="btn btn-gold">Save institution</button>
    </form>
  );
}

function IssueCert({ enrollments, onDone }: { enrollments: Snapshot["enrollments"]; onDone: () => Promise<void> }) {
  const active = enrollments.filter((item) => item.status === "active");
  const [studentId, setStudentId] = useState(active[0]?.userId || "");
  const [courseSlug, setCourseSlug] = useState(active[0]?.courseSlug || "");
  return (
    <form
      className="card-surface p-4 grid md:grid-cols-3 gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        act("issueCertificate", { studentId, courseSlug }).then(onDone);
      }}
    >
      <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
        {active.map((item) => (
          <option key={item.id} value={item.userId}>{item.userId}</option>
        ))}
      </select>
      <select value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)}>
        {[...new Set(active.map((item) => item.courseSlug))].map((slug) => (
          <option key={slug}>{slug}</option>
        ))}
      </select>
      <button className="btn btn-gold">Issue certificate</button>
    </form>
  );
}

function AnnounceForm({ onDone, items }: { onDone: () => Promise<void>; items: Snapshot["announcements"] }) {
  const [form, setForm] = useState({ title: "", body: "", audience: "ALL" });
  return (
    <div className="space-y-4">
      <form
        className="card-surface p-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          act("saveAnnouncement", form).then(onDone);
        }}
      >
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea required placeholder="Message" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
          <option value="ALL">Everyone</option>
          <option value="STUDENT">Students</option>
          <option value="TEACHER">Teachers</option>
        </select>
        <button className="btn btn-gold">Publish</button>
      </form>
      {items.map((item) => (
        <article key={item.id} className="card-surface p-4">
          <p className="font-semibold text-green-deep">{item.title}</p>
          <p className="text-sm text-muted">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function ClassForm({ courses, onDone }: { courses: Snapshot["courses"]; onDone: () => Promise<void> }) {
  const [form, setForm] = useState({ courseSlug: courses[0]?.slug || "", title: "", startsAt: "", durationMin: 45, joinUrl: "https://meet.google.com/", status: "scheduled" });
  return (
    <form
      className="card-surface p-4 grid md:grid-cols-2 gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        act("saveClass", { ...form, durationMin: Number(form.durationMin) }).then(onDone);
      }}
    >
      <select value={form.courseSlug} onChange={(e) => setForm({ ...form, courseSlug: e.target.value })}>
        {courses.map((course) => <option key={course.slug} value={course.slug}>{course.title}</option>)}
      </select>
      <input required placeholder="Class title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input required type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
      <input required type="url" placeholder="Live class join URL" value={form.joinUrl} onChange={(e) => setForm({ ...form, joinUrl: e.target.value })} />
      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
        <option value="scheduled">Scheduled</option>
        <option value="live">Live</option>
        <option value="completed">Completed</option>
      </select>
      <button className="btn btn-gold">Save class</button>
    </form>
  );
}

function AssignmentForm({ courses, onDone }: { courses: Snapshot["courses"]; onDone: () => Promise<void> }) {
  const [form, setForm] = useState({ courseSlug: courses[0]?.slug || "", title: "", instructions: "", dueAt: "" });
  return (
    <form
      className="card-surface p-4 grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        act("saveAssignment", form).then(onDone);
      }}
    >
      <select value={form.courseSlug} onChange={(e) => setForm({ ...form, courseSlug: e.target.value })}>
        {courses.map((course) => <option key={course.slug} value={course.slug}>{course.title}</option>)}
      </select>
      <input required placeholder="Assignment title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea required placeholder="Instructions" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
      <input required type="datetime-local" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} />
      <button className="btn btn-gold">Create assignment</button>
    </form>
  );
}

function GradeBox({ submissionId, onDone }: { submissionId: string; onDone: () => Promise<void> }) {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  return (
    <form
      className="grid md:grid-cols-3 gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        act("gradeSubmission", { submissionId, grade, feedback }).then(onDone);
      }}
    >
      <input placeholder="Grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
      <input placeholder="Feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
      <button className="btn btn-green !py-2">Save grade</button>
    </form>
  );
}

function QuizForm({ courses, onDone }: { courses: Snapshot["courses"]; onDone: () => Promise<void> }) {
  const [courseSlug, setCourseSlug] = useState(courses[0]?.slug || "");
  const [title, setTitle] = useState("");
  const [q, setQ] = useState("");
  const [options, setOptions] = useState("A, B, C, D");
  const [answerIndex, setAnswerIndex] = useState(0);
  return (
    <form
      className="card-surface p-4 grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        act("saveQuiz", {
          courseSlug,
          title,
          questions: [{ q, options: options.split(",").map((item) => item.trim()), answerIndex: Number(answerIndex) }],
        }).then(onDone);
      }}
    >
      <select value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)}>
        {courses.map((course) => <option key={course.slug} value={course.slug}>{course.title}</option>)}
      </select>
      <input required placeholder="Quiz title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input required placeholder="Question" value={q} onChange={(e) => setQ(e.target.value)} />
      <input required placeholder="Options, comma separated" value={options} onChange={(e) => setOptions(e.target.value)} />
      <input type="number" min={0} value={answerIndex} onChange={(e) => setAnswerIndex(Number(e.target.value))} />
      <button className="btn btn-gold">Create quiz</button>
    </form>
  );
}

function AttendanceForm({ data, onDone }: { data: Snapshot; onDone: () => Promise<void> }) {
  const students = data.users.filter((u) => u.role === "STUDENT");
  const [classId, setClassId] = useState(data.classes[0]?.id || "");
  const [studentId, setStudentId] = useState(students[0]?.id || "");
  return (
    <form
      className="card-surface p-4 grid md:grid-cols-4 gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        act("recordAttendance", { classId, studentId, present: true }).then(onDone);
      }}
    >
      <select value={classId} onChange={(e) => setClassId(e.target.value)}>
        {data.classes.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select>
      <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
        {students.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <button className="btn btn-gold md:col-span-2">Mark present</button>
    </form>
  );
}

function FeedbackBox({ courses, onDone, items }: { courses: Snapshot["courses"]; onDone: () => Promise<void>; items: Snapshot["feedback"] }) {
  const [message, setMessage] = useState("");
  const [courseSlug, setCourseSlug] = useState(courses[0]?.slug || "");
  return (
    <div className="space-y-4">
      <form
        className="card-surface p-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          act("addFeedback", { message, courseSlug }).then(() => {
            setMessage("");
            onDone();
          });
        }}
      >
        <select value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)}>
          {courses.map((course) => <option key={course.slug} value={course.slug}>{course.title}</option>)}
        </select>
        <textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Feedback for the student or office" />
        <button className="btn btn-gold">Send feedback</button>
      </form>
      {items.map((item) => (
        <article key={item.id} className="card-surface p-4 text-sm">{item.message}</article>
      ))}
    </div>
  );
}

function StudentAssignment({ assignment, onDone }: { assignment: Snapshot["assignments"][number]; onDone: () => Promise<void> }) {
  const [content, setContent] = useState("");
  return (
    <article className="card-surface p-4 space-y-3">
      <h2 className="font-semibold text-green-deep">{assignment.title}</h2>
      <p className="text-sm text-muted">{assignment.instructions}</p>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Your submission" />
      <button className="btn btn-gold !py-2" onClick={() => act("submitAssignment", { assignmentId: assignment.id, content }).then(onDone)}>Submit</button>
    </article>
  );
}

function StudentQuiz({ quiz, onDone }: { quiz: Snapshot["quizzes"][number]; onDone: () => Promise<void> }) {
  const [answers, setAnswers] = useState<number[]>(quiz.questions.map(() => 0));
  return (
    <article className="card-surface p-4 space-y-3">
      <h2 className="font-semibold text-green-deep">{quiz.title}</h2>
      {quiz.questions.map((question, qi) => (
        <div key={question.q}>
          <p>{question.q}</p>
          <select value={answers[qi]} onChange={(e) => setAnswers((current) => current.map((value, i) => (i === qi ? Number(e.target.value) : value)))}>
            {question.options.map((option, oi) => (
              <option key={option} value={oi}>{option}</option>
            ))}
          </select>
        </div>
      ))}
      <button className="btn btn-gold !py-2" onClick={() => act("submitQuiz", { quizId: quiz.id, answers }).then(onDone)}>Submit quiz</button>
    </article>
  );
}
