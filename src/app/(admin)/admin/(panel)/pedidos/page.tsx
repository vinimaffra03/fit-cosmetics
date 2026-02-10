import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { OrdersClient } from "@/components/admin/orders/orders-client";

export const metadata: Metadata = {
  title: "Pedidos | Admin",
};

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      payment: true,
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const serialized = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.user.name || o.user.email,
    status: o.status,
    total: o.total,
    itemCount: o._count.items,
    paymentMethod: o.payment?.method ?? null,
    paymentStatus: o.payment?.status ?? null,
    createdAt: o.createdAt.toISOString(),
  }));

  return <OrdersClient orders={serialized} />;
}
