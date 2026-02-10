import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { CustomersClient } from "@/components/admin/customers/customers-client";

export const metadata: Metadata = {
  title: "Clientes | Admin",
};

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  const serialized = customers.map((c) => ({
    id: c.id,
    name: c.name || `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || "Sem nome",
    email: c.email,
    phone: c.phoneNumber,
    orderCount: c._count.orders,
    createdAt: c.createdAt.toISOString(),
  }));

  return <CustomersClient customers={serialized} />;
}
