import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ProductsClient } from "@/components/admin/products/products-client";

export const metadata: Metadata = {
  title: "Produtos | Admin",
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stock: p.stock,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    categoryName: p.category?.name ?? null,
    image: p.images[0]?.url ?? null,
    createdAt: p.createdAt.toISOString(),
  }));

  return <ProductsClient products={serialized} />;
}
