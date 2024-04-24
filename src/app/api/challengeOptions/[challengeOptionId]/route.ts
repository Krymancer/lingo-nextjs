import database from "@/database/drizzle";
import { challengeOptions } from "@/database/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { challengeOptionsId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const data = await database.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, params.challengeOptionsId),
  });

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { challengeOptionsId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const body = await request.json();

  const data = await database.update(challengeOptions).set({
    ...body,
  }).where(eq(challengeOptions.id, params.challengeOptionsId)).returning();

  return NextResponse.json(data[0]);
}

export async function DELETE(request: Request, { params }: { params: { challengeOptionsId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const data = await database.delete(challengeOptions).where(eq(challengeOptions.id, params.challengeOptionsId)).returning();

  return NextResponse.json(data[0]);
}

