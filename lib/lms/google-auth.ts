import { HttpError } from "@/lib/lms/types";
import { getAdminAuth } from "@/lib/firebase-admin";

export type VerifiedGoogleAccount = {
  uid: string;
  email: string;
  name: string;
  photoUrl: string | null;
};

export async function verifyGoogleIdToken(idToken: string): Promise<VerifiedGoogleAccount> {
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const email = decoded.email?.trim().toLowerCase();
    if (!email) throw new HttpError(400, "Your Google account does not include an email address.");
    return {
      uid: decoded.uid,
      email,
      name: decoded.name?.trim() || email.split("@")[0],
      photoUrl: decoded.picture || null,
    };
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(401, "Google sign-in could not be verified.");
  }
}
