import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { couponSchema } from "@/lib/validations/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const coupon = await prisma.coupon.findUnique({
    where: { id: params.id },
  });

  if (!coupon) {
    return NextResponse.json(
      { error: "Cupom nao encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(coupon);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = couponSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const d = parsed.data;
    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        code: d.code!,
        discountType: d.discountType!,
        discountValue: d.discountValue!,
        startsAt: d.startsAt!,
        description: d.description,
        minPurchase: d.minPurchase,
        maxDiscount: d.maxDiscount,
        usageLimit: d.usageLimit,
        isActive: d.isActive ?? true,
        expiresAt: d.expiresAt,
      },
    });
    return NextResponse.json(coupon);
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Codigo de cupom ja existe" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar cupom" },
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
    await prisma.coupon.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao excluir cupom" },
      { status: 500 }
    );
  }
}
