import { NextResponse } from "next/server";
import database from "@/database/drizzle";
import { courses } from "@/database/schema";
import { getIsAdmin } from "@/lib/admin";

export async function GET() {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Forbiden", { status: 403 });

  const data = await database.query.courses.findMany();
  return NextResponse.json(data);
};

export async function POST(request: Request) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Forbiden", { status: 403 });

  const body = await request.json();

  const data = await database.insert(courses).values({
    ...body
  }).returning();

  return NextResponse.json(data[0]);
};