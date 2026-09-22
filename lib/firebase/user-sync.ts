import { prisma } from "@/lib/prisma";
import { getAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { removeDocument, writeDocument } from "@/lib/firestore/access";
import type { Role } from "@/lib/lms/types";

const ROLE_COLLECTION: Record<Role, string> = {
  ADMIN: "admins",
  TEACHER: "teachers",
  STUDENT: "students",
  USER: "visitors",
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role | string;
  status: string;
  qualification?: string | null;
  experience?: string | null;
  studentCode?: string | null;
  dateOfBirth?: string | null;
  firebaseUid?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

function iso(value?: Date | string | null) {
  if (!value) return new Date().toISOString();
  return value instanceof Date ? value.toISOString() : String(value);
}

function profilePayload(user: UserRow, firebaseUid?: string | null) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || null,
    role: user.role,
    status: user.status,
    qualification: user.qualification || null,
    experience: user.experience || null,
    studentCode: user.studentCode || null,
    dateOfBirth: user.dateOfBirth || null,
    firebaseUid: firebaseUid || user.firebaseUid || null,
    createdAt: iso(user.createdAt),
    updatedAt: new Date().toISOString(),
    source: "alvasatiya-lms",
  };
}

function roleCollection(role: string) {
  return ROLE_COLLECTION[role as Role] || "visitors";
}

async function createAuthUserViaApi(email: string, password: string, name: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey || !password) return null;
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName: name, returnSecureToken: true }),
  });
  const data = (await response.json().catch(() => ({}))) as { localId?: string };
  return data.localId || null;
}

async function ensureFirebaseAuthUser(user: UserRow, password?: string) {
  if (isFirebaseAdminConfigured()) {
    try {
      const auth = getAdminAuth();
      if (user.firebaseUid) {
        try {
          await auth.getUser(user.firebaseUid);
          return user.firebaseUid;
        } catch {
          // Look up by email below.
        }
      }
      try {
        const existing = await auth.getUserByEmail(user.email);
        return existing.uid;
      } catch {
        if (!password) return user.firebaseUid || null;
        const created = await auth.createUser({
          email: user.email,
          password,
          displayName: user.name,
          disabled: user.status !== "ACTIVE",
        });
        return created.uid;
      }
    } catch {
      // Service account may be revoked; fall through to the public Auth API.
    }
  }
  if (user.firebaseUid) return user.firebaseUid;
  if (!password) return null;
  return createAuthUserViaApi(user.email, password, user.name);
}

export async function syncUserToFirebase(user: UserRow, options?: { password?: string }) {
  let firebaseUid = user.firebaseUid || null;
  try {
    firebaseUid = (await ensureFirebaseAuthUser(user, options?.password)) || firebaseUid;
    if (firebaseUid && firebaseUid !== user.firebaseUid) {
      await prisma.user.update({ where: { id: user.id }, data: { firebaseUid } });
    }
  } catch {
    firebaseUid = user.firebaseUid || null;
  }

  const payload = profilePayload(user, firebaseUid);
  const roleName = roleCollection(String(user.role));
  await writeDocument("users", user.id, payload);
  await writeDocument(roleName, user.id, payload);

  for (const extra of ["admins", "teachers", "students", "visitors"]) {
    if (extra === roleName) continue;
    try {
      await removeDocument(extra, user.id);
    } catch {
      // Role mirrors are optional cleanup.
    }
  }

  return payload;
}

export async function removeUserFromFirebase(user: Pick<UserRow, "id" | "role" | "firebaseUid" | "email">) {
  await removeDocument("users", user.id);
  await removeDocument(roleCollection(String(user.role)), user.id);
  try {
    if (isFirebaseAdminConfigured()) {
      const auth = getAdminAuth();
      if (user.firebaseUid) await auth.deleteUser(user.firebaseUid);
      else if (user.email) {
        const existing = await auth.getUserByEmail(user.email);
        await auth.deleteUser(existing.uid);
      }
    }
  } catch {
    // Auth user may already be gone.
  }
}

export async function syncAllUsersToFirebase() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    await syncUserToFirebase(user as UserRow);
  }
}
