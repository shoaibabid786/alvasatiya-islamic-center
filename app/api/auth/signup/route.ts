import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Students cannot register themselves. An administrator must create the account, then the student can log in.",
    },
    { status: 403 },
  );
}
