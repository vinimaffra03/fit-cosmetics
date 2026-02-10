import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { couponSchema } from "@/lib/validations/admin";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
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
    const coupon = await prisma.coupon.create({
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
    return NextResponse.json(coupon, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Codigo de cupom ja existe" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar cupom" },
      { status: 500 }
    );
  }
}
