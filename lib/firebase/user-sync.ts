import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase";
import { prisma } from "@/lib/prisma";
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

async function createFirebaseAuthUser(email: string, password: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey || !password) return null;
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = (await response.json().catch(() => ({}))) as { localId?: string; error?: { message?: string } };
  if (data.localId) return data.localId;
  return null;
}

export async function syncUserToFirebase(user: UserRow, options?: { password?: string }) {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.");
  }

  let firebaseUid = user.firebaseUid || null;
  if (options?.password && !firebaseUid) {
    try {
      firebaseUid = (await createFirebaseAuthUser(user.email, options.password)) || firebaseUid;
      if (firebaseUid && firebaseUid !== user.firebaseUid) {
        await prisma.user.update({ where: { id: user.id }, data: { firebaseUid } });
      }
    } catch {
      firebaseUid = user.firebaseUid || null;
    }
  }

  const db = getFirestoreDb();
  const payload = profilePayload(user, firebaseUid);
  const roleName = roleCollection(String(user.role));

  await setDoc(doc(db, "users", user.id), { ...payload }, { merge: true });
  await setDoc(doc(db, roleName, user.id), payload);

  for (const extra of ["admins", "teachers", "students", "visitors"]) {
    if (extra === roleName) continue;
    try {
      await deleteDoc(doc(db, extra, user.id));
    } catch {
      // Role mirrors are optional cleanup.
    }
  }

  return payload;
}

export async function removeUserFromFirebase(user: Pick<UserRow, "id" | "role">) {
  if (!isFirebaseConfigured()) return;
  const db = getFirestoreDb();
  await deleteDoc(doc(db, "users", user.id));
  await deleteDoc(doc(db, roleCollection(String(user.role)), user.id));
}

export async function syncAllUsersToFirebase() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    await syncUserToFirebase(user as UserRow);
  }
}
