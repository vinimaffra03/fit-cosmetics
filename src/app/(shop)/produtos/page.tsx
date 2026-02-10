import { Metadata } from "next";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Confira nossa linha completa de progressivas, kits e produtos de manutenção capilar profissional.",
};

async function getProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { position: "asc" },
  });
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="section-padding">
      <div className="container-shop">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">
            Todos os Produtos
          </h1>
          <p className="mt-2 text-muted-foreground">
            {products.length} produtos encontrados
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              Nenhum produto encontrado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
