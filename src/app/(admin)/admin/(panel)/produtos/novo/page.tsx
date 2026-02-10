import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/products/product-form";

export const metadata: Metadata = {
  title: "Novo Produto | Admin",
};

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Novo Produto</h1>
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        brands={brands.map((b) => ({ id: b.id, name: b.name }))}
      />
    </div>
  );
}
