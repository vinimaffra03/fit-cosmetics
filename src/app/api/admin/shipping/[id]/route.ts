import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { shippingZoneSchema } from "@/lib/validations/admin";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const zone = await prisma.shippingZone.update({
      where: { id: params.id },
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
    return NextResponse.json(zone);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar zona de frete" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.shippingZone.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao excluir zona de frete" },
      { status: 500 }
    );
  }
}
