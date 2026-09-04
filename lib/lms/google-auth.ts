import { HttpError } from "@/lib/lms/types";

type FirebaseLookupUser = {
  localId?: string;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  photoUrl?: string;
};

export type VerifiedGoogleAccount = {
  uid: string;
  email: string;
  name: string;
  photoUrl: string | null;
};

export async function verifyGoogleIdToken(idToken: string): Promise<VerifiedGoogleAccount> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) throw new HttpError(500, "Firebase is not configured.");

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const data = (await response.json()) as { users?: FirebaseLookupUser[]; error?: { message?: string } };
  const account = data.users?.[0];
  if (!response.ok || !account) {
    throw new HttpError(401, "Google sign-in could not be verified.");
  }
  const email = account.email?.trim().toLowerCase();
  if (!email) throw new HttpError(400, "Your Google account does not include an email address.");

  return {
    uid: account.localId || email,
    email,
    name: account.displayName?.trim() || email.split("@")[0],
    photoUrl: account.photoUrl || null,
  };
}
