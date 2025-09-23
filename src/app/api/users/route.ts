import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await createConnection();
    const sqlQuery = "select * from users";
    const [users] = await db.query(sqlQuery);
    return NextResponse.json(users);
  } catch (error: unknown) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
