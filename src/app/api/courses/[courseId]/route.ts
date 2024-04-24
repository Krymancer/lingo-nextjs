import database from "@/database/drizzle";
import { courses } from "@/database/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { courseId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const data = await database.query.courses.findFirst({
    where: eq(courses.id, params.courseId),
  });

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { courseId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const body = await request.json();

  const data = await database.update(courses).set({
    ...body,
  }).where(eq(courses.id, params.courseId)).returning();

  return NextResponse.json(data[0]);
}

export async function DELETE(request: Request, { params }: { params: { courseId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const data = await database.delete(courses).where(eq(courses.id, params.courseId)).returning();

  return NextResponse.json(data[0]);
}

