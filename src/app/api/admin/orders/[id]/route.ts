import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { orderStatusSchema } from "@/lib/validations/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      address: true,
      items: true,
      payment: true,
      coupon: true,
    },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Pedido nao encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = orderStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: parsed.data.status!,
        trackingNumber: parsed.data.trackingNumber || null,
        trackingUrl: parsed.data.trackingUrl || null,
        notes: parsed.data.notes || null,
      },
      include: { user: true, payment: true },
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar pedido" },
      { status: 500 }
    );
  }
}
