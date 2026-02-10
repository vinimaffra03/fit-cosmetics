import { Metadata } from "next";
import { CouponForm } from "@/components/admin/coupons/coupon-form";

export const metadata: Metadata = {
  title: "Novo Cupom | Admin",
};

export default function NewCouponPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Novo Cupom</h1>
      <CouponForm />
    </div>
  );
}
