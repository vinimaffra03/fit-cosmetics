import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { CustomerDetail } from "@/components/admin/customers/customer-detail";

export const metadata: Metadata = {
  title: "Detalhe do Cliente | Admin",
};

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
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

  if (!user) notFound();

  const totalSpent = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      userId: params.id,
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
  });

  const serialized = {
    id: user.id,
    name: user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    email: user.email,
    phone: user.phoneNumber,
    cpf: user.cpf,
    createdAt: user.createdAt.toISOString(),
    totalSpent: totalSpent._sum.total ?? 0,
    orderCount: user.orders.length,
    orders: user.orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: o.total,
      createdAt: o.createdAt.toISOString(),
    })),
    addresses: user.addresses.map((a) => ({
      id: a.id,
      label: a.label,
      street: a.street,
      number: a.number,
      complement: a.complement,
      neighborhood: a.neighborhood,
      city: a.city,
      state: a.state,
      zipCode: a.zipCode,
      isDefault: a.isDefault,
    })),
    reviews: user.reviews.map((r) => ({
      id: r.id,
      productName: r.product.name,
      rating: r.rating,
      comment: r.comment,
      isApproved: r.isApproved,
      createdAt: r.createdAt.toISOString(),
    })),
  };

  return <CustomerDetail customer={serialized} />;
}
