export type StoredForm = {
  id: string;
  type: "contact" | "feedback" | "fatwa" | "donate" | "enroll" | "event";
  createdAt: string;
  payload: Record<string, string | number>;
};

const KEY = "alvasatiya-forms";

export function saveForm(type: StoredForm["type"], payload: Record<string, string | number>) {
  const entry: StoredForm = {
    id: crypto.randomUUID(),
    type,
    createdAt: new Date().toISOString(),
    payload,
  };
  if (typeof window === "undefined") return entry;
  const current: StoredForm[] = JSON.parse(localStorage.getItem(KEY) || "[]");
  current.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(current.slice(0, 100)));
  return entry;
}
