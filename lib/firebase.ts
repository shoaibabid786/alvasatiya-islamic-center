/** Browser Firebase (Auth + Analytics). Server code must use `@/lib/firebase-admin`. */
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import type { Analytics } from "firebase/analytics";

function readConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    return null;
  }
  return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId };
}

export function isFirebaseConfigured() {
  return Boolean(readConfig());
}

export function getFirebaseApp(): FirebaseApp | null {
  const config = readConfig();
  if (!config) return null;
  return getApps().length ? getApp() : initializeApp(config);
}

export const FIRESTORE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "alvasatiya-islamic-center";
export const FIRESTORE_DATABASE_ID = "(default)";

let firestoreDb: Firestore | null = null;

export function getFirestoreDb(): Firestore {
  if (firestoreDb) return firestoreDb;
  const app = getFirebaseApp();
  if (!app) {
    throw new Error(
      "Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars to use Firestore.",
    );
  }
  const settings = {
    ignoreUndefinedProperties: true,
  };
  try {
    firestoreDb = initializeFirestore(app, settings, FIRESTORE_DATABASE_ID);
  } catch {
    firestoreDb = getFirestore(app, FIRESTORE_DATABASE_ID);
  }
  return firestoreDb;
}

export function getFirebaseAuth(): Auth {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.");
  }
  return getAuth(app);
}

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      const { getAnalytics, isSupported } = await import("firebase/analytics");
      const app = getFirebaseApp();
      if (!app || !(await isSupported())) return null;
      return getAnalytics(app);
    })();
  }
  return analyticsPromise;
}
