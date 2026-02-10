import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { CouponsClient } from "@/components/admin/coupons/coupons-client";

export const metadata: Metadata = {
  title: "Cupons | Admin",
};

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  const serialized = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    description: c.description,
    discountType: c.discountType,
    discountValue: c.discountValue,
    minPurchase: c.minPurchase,
    maxDiscount: c.maxDiscount,
    usageLimit: c.usageLimit,
    usageCount: c.usageCount,
    isActive: c.isActive,
    startsAt: c.startsAt.toISOString(),
    expiresAt: c.expiresAt?.toISOString() ?? null,
    orderCount: c._count.orders,
  }));

  return <CouponsClient coupons={serialized} />;
}
