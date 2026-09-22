import { getAdminFirestore } from "@/lib/firebase-admin";

type Dict = Record<string, any>;

let mode: "admin" | "rest" = "rest";

function projectId() {
  return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "alvasatiya-islamic-center";
}

function isCredError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /UNAUTHENTICATED|unauthenticated|invalid_grant|invalid authentication|invalid jwt/i.test(message);
}

function decodeValue(value: any): any {
  if (!value || typeof value !== "object") return value;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("booleanValue" in value) return Boolean(value.booleanValue);
  if ("nullValue" in value) return null;
  if ("timestampValue" in value) return value.timestampValue;
  if ("mapValue" in value) {
    const fields = value.mapValue?.fields || {};
    const next: Dict = {};
    for (const [key, item] of Object.entries(fields)) next[key] = decodeValue(item);
    return next;
  }
  if ("arrayValue" in value) return (value.arrayValue?.values || []).map(decodeValue);
  return value;
}

function encodeValue(value: unknown): Dict {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  if (typeof value === "object") {
    const fields: Dict = {};
    for (const [key, item] of Object.entries(value)) {
      if (item === undefined) continue;
      fields[key] = encodeValue(item);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function encodeFields(data: Dict) {
  const fields: Dict = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    fields[key] = encodeValue(value);
  }
  return fields;
}

async function rest(path: string, init?: RequestInit) {
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error?.message || `Firestore request failed (${response.status})`);
  }
  return body;
}

async function listViaRest(name: string) {
  const body = await rest(`/${encodeURIComponent(name)}`);
  return (body.documents || []).map((item: any) => {
    const id = String(item.name || "").split("/").pop();
    const data: Dict = {};
    for (const [key, value] of Object.entries(item.fields || {})) data[key] = decodeValue(value);
    return { id, ...data };
  });
}

async function writeViaRest(name: string, id: string, data: Dict) {
  try {
    await rest(`/${encodeURIComponent(name)}?documentId=${encodeURIComponent(id)}`, {
      method: "POST",
      body: JSON.stringify({ fields: encodeFields(data) }),
    });
  } catch (error) {
    if (!/already exists|ALREADY_EXISTS|409/i.test(error instanceof Error ? error.message : "")) throw error;
    await rest(`/${encodeURIComponent(name)}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ fields: encodeFields(data) }),
    });
  }
}

async function removeViaRest(name: string, id: string) {
  await rest(`/${encodeURIComponent(name)}/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function listDocuments(name: string) {
  if (mode === "admin") {
    try {
      const snap = await getAdminFirestore().collection(name).get();
      return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
    } catch (error) {
      if (!isCredError(error)) throw error;
      mode = "rest";
    }
  }
  return listViaRest(name);
}

export async function writeDocument(name: string, id: string, data: Dict) {
  if (mode === "admin") {
    try {
      await getAdminFirestore().collection(name).doc(id).set(data);
      return;
    } catch (error) {
      if (!isCredError(error)) throw error;
      mode = "rest";
    }
  }
  await writeViaRest(name, id, data);
}

export async function removeDocument(name: string, id: string) {
  if (mode === "admin") {
    try {
      await getAdminFirestore().collection(name).doc(id).delete();
      return;
    } catch (error) {
      if (!isCredError(error)) throw error;
      mode = "rest";
    }
  }
  await removeViaRest(name, id);
}
