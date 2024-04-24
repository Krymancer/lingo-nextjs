import database from "@/database/drizzle";
import { challenges } from "@/database/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { challengeId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const data = await database.query.challenges.findFirst({
    where: eq(challenges.id, params.challengeId),
  });

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { challengeId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const body = await request.json();

  const data = await database.update(challenges).set({
    ...body,
  }).where(eq(challenges.id, params.challengeId)).returning();

  return NextResponse.json(data[0]);
}

export async function DELETE(request: Request, { params }: { params: { challengeId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const data = await database.delete(challenges).where(eq(challenges.id, params.challengeId)).returning();

  return NextResponse.json(data[0]);
}

