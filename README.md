# Alvasatiya Education LMS

Role-based Education Management System with **Admin**, **Teacher**, and **Student** dashboards.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Environment is already described in `.env.example`. Copy it if needed:

```bash
copy .env.example .env
```

3. Enable **Cloud Firestore** in the Firebase console for project `alvasatiya-islamic-center` (database ID: `(default)`). Publish `firestore.rules` if writes are denied.

4. Seed real records into Firestore:

```bash
npm run firestore:seed
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000/login`.

## Demo accounts

| Role    | Email                 | Password       |
| ------- | --------------------- | -------------- |
| Admin   | admin@example.com     | Admin@2026!    |
| Teacher | teacher@example.com   | Teacher@2026!  |
| Student | student@example.com   | Student@2026!  |

Also seeded:

- `admin@alvasatiya.org` / `AlvasatiyaAdmin!2026`
- `teacher@alvasatiya.org` / `AlvasatiyaTeacher!2026`

Sample class codes: `QRN101`, `FQH201`  
Join URL format: `http://localhost:3000/join/QRN101`

## After login

- Admin → `/admin/dashboard`
- Teacher → `/teacher/dashboard`
- Student → `/student/dashboard`

Unauthorized role URLs are redirected to the user's own dashboard.

## Database

The LMS stores users, classes, scheduled live meetings, attendance, quizzes, assignments, and announcements in **Cloud Firestore**.

- Firebase project: `alvasatiya-islamic-center`
- Firestore database: `(default)`

Collections: `users`, `sessions`, `classes`, `classMembers`, `liveMeetings`, `quizzes`, `questions`, `quizAttempts`, `quizAnswers`, `assignments`, `assignmentSubmissions`, `attendance`, `announcements`, `settings`.

Dashboards load live counts from those collections. Firebase Analytics is separate and only tracks page views.

## File uploads

Student assignment files are stored under `uploads/` (not in the browser). Allowed types: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, ZIP. Maximum size: 10MB.
