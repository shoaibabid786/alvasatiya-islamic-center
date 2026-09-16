import { prisma } from "@/lib/prisma";
import { getAdminAuth, getAdminFirestore, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
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

async function ensureFirebaseAuthUser(user: UserRow, password?: string) {
  const auth = getAdminAuth();
  if (user.firebaseUid) {
    try {
      await auth.getUser(user.firebaseUid);
      return user.firebaseUid;
    } catch {
      // UID in Firestore is stale; look up by email below.
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
}

export async function syncUserToFirebase(user: UserRow, options?: { password?: string }) {
  if (!isFirebaseAdminConfigured()) {
    throw new Error("Firebase Admin is not configured. Add the service account to .env.");
  }

  let firebaseUid = user.firebaseUid || null;
  try {
    firebaseUid = (await ensureFirebaseAuthUser(user, options?.password)) || firebaseUid;
    if (firebaseUid && firebaseUid !== user.firebaseUid) {
      await prisma.user.update({ where: { id: user.id }, data: { firebaseUid } });
    }
  } catch {
    firebaseUid = user.firebaseUid || null;
  }

  const db = getAdminFirestore();
  const payload = profilePayload(user, firebaseUid);
  const roleName = roleCollection(String(user.role));

  await db.collection("users").doc(user.id).set(payload, { merge: true });
  await db.collection(roleName).doc(user.id).set(payload, { merge: true });

  for (const extra of ["admins", "teachers", "students", "visitors"]) {
    if (extra === roleName) continue;
    try {
      await db.collection(extra).doc(user.id).delete();
    } catch {
      // Role mirrors are optional cleanup.
    }
  }

  return payload;
}

export async function removeUserFromFirebase(user: Pick<UserRow, "id" | "role" | "firebaseUid" | "email">) {
  if (!isFirebaseAdminConfigured()) return;
  const db = getAdminFirestore();
  await db.collection("users").doc(user.id).delete();
  await db.collection(roleCollection(String(user.role))).doc(user.id).delete();
  try {
    const auth = getAdminAuth();
    if (user.firebaseUid) await auth.deleteUser(user.firebaseUid);
    else if (user.email) {
      const existing = await auth.getUserByEmail(user.email);
      await auth.deleteUser(existing.uid);
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
