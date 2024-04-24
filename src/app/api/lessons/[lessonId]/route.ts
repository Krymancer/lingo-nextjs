import database from "@/database/drizzle";
import { lessons } from "@/database/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { lessonId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const data = await database.query.lessons.findFirst({
    where: eq(lessons.id, params.lessonId),
  });

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { lessonId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const body = await request.json();

  const data = await database.update(lessons).set({
    ...body,
  }).where(eq(lessons.id, params.lessonId)).returning();

  return NextResponse.json(data[0]);
}

export async function DELETE(request: Request, { params }: { params: { lessonId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const data = await database.delete(lessons).where(eq(lessons.id, params.lessonId)).returning();

  return NextResponse.json(data[0]);
}

