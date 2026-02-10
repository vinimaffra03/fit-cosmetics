import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { shippingZoneSchema } from "@/lib/validations/admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const zones = await prisma.shippingZone.findMany({
    orderBy: { zipCodeStart: "asc" },
  });

  return NextResponse.json(zones);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = shippingZoneSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const d = parsed.data;
    const zone = await prisma.shippingZone.create({
      data: {
        name: d.name!,
        zipCodeStart: d.zipCodeStart!,
        zipCodeEnd: d.zipCodeEnd!,
        basePrice: d.basePrice!,
        pricePerKg: d.pricePerKg ?? 0,
        freeShippingMin: d.freeShippingMin,
        estimatedDays: d.estimatedDays!,
        isActive: d.isActive ?? true,
      },
    });
    return NextResponse.json(zone, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar zona de frete" },
      { status: 500 }
    );
  }
}
