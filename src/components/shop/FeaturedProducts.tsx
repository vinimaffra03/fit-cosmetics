import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/shop/ProductCard";
import prisma from "@/lib/prisma";

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return products;
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="section-padding bg-cream">
      <div className="container-shop">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">
              Produtos em Destaque
            </h2>
            <p className="mt-2 text-muted-foreground">
              Os mais vendidos e favoritos dos nossos clientes
            </p>
          </div>
          <Button asChild variant="outline" className="btn-outline-gold">
            <Link href="/produtos">
              Ver Todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
