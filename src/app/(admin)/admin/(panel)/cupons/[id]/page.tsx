import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { CouponForm } from "@/components/admin/coupons/coupon-form";

export const metadata: Metadata = {
  title: "Editar Cupom | Admin",
};

export default async function EditCouponPage({
  params,
}: {
  params: { id: string };
}) {
  const coupon = await prisma.coupon.findUnique({
    where: { id: params.id },
  });

  if (!coupon) notFound();

  const defaultValues = {
    code: coupon.code,
    description: coupon.description ?? "",
    discountType: coupon.discountType as "PERCENTAGE" | "FIXED" | "FREE_SHIPPING",
    discountValue: coupon.discountValue,
    minPurchase: coupon.minPurchase,
    maxDiscount: coupon.maxDiscount,
    usageLimit: coupon.usageLimit,
    isActive: coupon.isActive,
    startsAt: coupon.startsAt,
    expiresAt: coupon.expiresAt,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Cupom</h1>
      <CouponForm couponId={coupon.id} defaultValues={defaultValues} />
    </div>
  );
}
