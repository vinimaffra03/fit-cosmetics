import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ShippingClient } from "@/components/admin/shipping/shipping-client";

export const metadata: Metadata = {
  title: "Frete | Admin",
};

export default async function ShippingPage() {
  const zones = await prisma.shippingZone.findMany({
    orderBy: { zipCodeStart: "asc" },
  });

  const serialized = zones.map((z) => ({
    id: z.id,
    name: z.name,
    zipCodeStart: z.zipCodeStart,
    zipCodeEnd: z.zipCodeEnd,
    basePrice: z.basePrice,
    pricePerKg: z.pricePerKg,
    freeShippingMin: z.freeShippingMin,
    estimatedDays: z.estimatedDays,
    isActive: z.isActive,
  }));

  return <ShippingClient zones={serialized} />;
}
