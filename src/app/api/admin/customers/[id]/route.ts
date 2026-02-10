import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      orders: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { payment: true },
      },
      addresses: true,
      reviews: {
        include: { product: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Cliente nao encontrado" },
      { status: 404 }
    );
  }

  const totalSpent = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      userId: params.id,
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
  });

  return NextResponse.json({
    ...user,
    totalSpent: totalSpent._sum.total ?? 0,
  });
}
