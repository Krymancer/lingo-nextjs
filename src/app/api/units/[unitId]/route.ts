import database from "@/database/drizzle";
import { units } from "@/database/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { unitId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const data = await database.query.units.findFirst({
    where: eq(units.id, params.unitId),
  });

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { unitId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const body = await request.json();

  const data = await database.update(units).set({
    ...body,
  }).where(eq(units.id, params.unitId)).returning();

  return NextResponse.json(data[0]);
}

export async function DELTE(request: Request, { params }: { params: { unitId: number } }) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const data = await database.delete(units).where(eq(units.id, params.unitId)).returning();

  return NextResponse.json(data[0]);
}

