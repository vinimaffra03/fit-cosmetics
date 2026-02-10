import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { OrderDetail } from "@/components/admin/orders/order-detail";

export const metadata: Metadata = {
  title: "Detalhe do Pedido | Admin",
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
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

  if (!order) notFound();

  const serialized = {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    discount: order.discount,
    shippingCost: order.shippingCost,
    total: order.total,
    notes: order.notes,
    trackingNumber: order.trackingNumber,
    trackingUrl: order.trackingUrl,
    createdAt: order.createdAt.toISOString(),
    customer: {
      name: order.user.name || `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim(),
      email: order.user.email,
      phone: order.user.phoneNumber,
      cpf: order.user.cpf,
    },
    address: order.address
      ? {
          street: order.address.street,
          number: order.address.number,
          complement: order.address.complement,
          neighborhood: order.address.neighborhood,
          city: order.address.city,
          state: order.address.state,
          zipCode: order.address.zipCode,
        }
      : null,
    items: order.items.map((i) => ({
      id: i.id,
      productName: i.productName,
      productImage: i.productImage,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      totalPrice: i.totalPrice,
    })),
    payment: order.payment
      ? {
          method: order.payment.method,
          status: order.payment.status,
          amount: order.payment.amount,
          externalId: order.payment.externalId,
          cardLastFour: order.payment.cardLastFour,
          cardBrand: order.payment.cardBrand,
          installments: order.payment.installments,
          pixCode: order.payment.pixCode,
          paidAt: order.payment.paidAt?.toISOString() ?? null,
        }
      : null,
    coupon: order.coupon
      ? { code: order.coupon.code, discountType: order.coupon.discountType, discountValue: order.coupon.discountValue }
      : null,
  };

  return <OrderDetail order={serialized} />;
}
