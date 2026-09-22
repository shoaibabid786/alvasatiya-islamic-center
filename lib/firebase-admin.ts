import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

type ServiceAccountInput = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function env(name: string) {
  return (process.env[name] || "").trim();
}

function asServiceAccount(raw: Record<string, unknown> | null | undefined): ServiceAccountInput | null {
  if (!raw) return null;
  const projectId = String(raw.project_id || raw.projectId || env("FIREBASE_PROJECT_ID") || env("NEXT_PUBLIC_FIREBASE_PROJECT_ID") || "");
  const clientEmail = String(raw.client_email || raw.clientEmail || "");
  const privateKey = String(raw.private_key || raw.privateKey || "").replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey.includes("BEGIN PRIVATE KEY")) return null;
  return { projectId, clientEmail, privateKey };
}

function readJsonFile(path: string) {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function discoverServiceAccountPath() {
  const explicit = env("FIREBASE_SERVICE_ACCOUNT_PATH") || env("GOOGLE_APPLICATION_CREDENTIALS");
  if (explicit && existsSync(explicit)) return explicit;

  const roots = [process.cwd(), join(process.cwd(), "..")];
  const names = ["sa.json", "serviceAccountKey.json", "service-account.json", "firebase-service-account.json", "firebase-adminsdk.json"];
  for (const root of roots) {
    for (const name of names) {
      const path = join(root, name);
      if (existsSync(path)) return path;
    }
    try {
      const match = readdirSync(root).find((file) => file.includes("firebase-adminsdk") && file.endsWith(".json"));
      if (match) return join(root, match);
    } catch {
      // Directory may be unreadable in some hosts.
    }
  }
  return "";
}

function loadServiceAccount(): ServiceAccountInput {
  const path = discoverServiceAccountPath();
  const fromFile = path ? asServiceAccount(readJsonFile(path)) : null;
  if (fromFile) return fromFile;

  const fromEnv = asServiceAccount({
    project_id: env("FIREBASE_PROJECT_ID") || env("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    client_email: env("FIREBASE_CLIENT_EMAIL"),
    private_key: env("FIREBASE_PRIVATE_KEY"),
  });
  if (fromEnv) return fromEnv;

  const json = env("FIREBASE_SERVICE_ACCOUNT_JSON");
  if (json) {
    try {
      const parsed = asServiceAccount(JSON.parse(json) as Record<string, unknown>);
      if (parsed) return parsed;
    } catch {
      // Fall through.
    }
  }

  throw new Error(
    "Firebase Admin is not configured. Add FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env (from the service account JSON), or set FIREBASE_SERVICE_ACCOUNT_PATH.",
  );
}

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

export function isFirebaseAdminConfigured() {
  try {
    loadServiceAccount();
    return true;
  } catch {
    return false;
  }
}

export function getFirebaseAdminApp(): App {
  if (adminApp) return adminApp;
  if (getApps().length) {
    adminApp = getApps()[0]!;
    return adminApp;
  }
  const account = loadServiceAccount();
  adminApp = initializeApp({
    credential: cert({
      projectId: account.projectId,
      clientEmail: account.clientEmail,
      privateKey: account.privateKey,
    }),
    projectId: account.projectId,
  });
  return adminApp;
}

export function getAdminAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminFirestore(): Firestore {
  if (adminDb) return adminDb;
  adminDb = getFirestore(getFirebaseAdminApp());
  try {
    adminDb.settings({ ignoreUndefinedProperties: true });
  } catch {
    // Settings can only be applied once per process.
  }
  return adminDb;
}
