import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Parse route placeholder" }, { status: 501 });
}
