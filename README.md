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

3. Create the database and demo data:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

4. Start the app:

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

The app uses **Prisma ORM**. Local development uses a SQLite file (`prisma/dev.db`) so the LMS runs without installing PostgreSQL. Data persists after restart.

`docker-compose.yml` is included for PostgreSQL:

```bash
docker compose up -d
```

Then set:

```
DATABASE_URL="postgresql://alvasatiya:alvasatiya@localhost:5432/alvasatiya_lms"
```

and change `provider` in `prisma/schema.prisma` to `postgresql` before running `npx prisma db push`.

## File uploads

Student assignment files are stored under `uploads/` (not in the browser). Allowed types: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, ZIP. Maximum size: 10MB.
