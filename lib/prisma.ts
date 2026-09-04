import { FirestoreStore } from "@/lib/firestore/adapter";

const globalForStore = globalThis as unknown as { prisma?: FirestoreStore };

export const prisma = globalForStore.prisma ?? new FirestoreStore();

if (process.env.NODE_ENV !== "production") globalForStore.prisma = prisma;
