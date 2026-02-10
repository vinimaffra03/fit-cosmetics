import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";

interface CategoryPageProps {
  params: { slug: string };
}

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { isActive: true },
        include: {
          images: { orderBy: { position: "asc" } },
          category: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return { title: "Categoria não encontrada" };
  }

  return {
    title: category.metaTitle || category.name,
    description:
      category.metaDescription ||
      category.description ||
      `Confira os produtos da categoria ${category.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="section-padding">
      <div className="container-shop">
        <div className="mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-muted-foreground max-w-2xl">
              {category.description}
            </p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {category.products.length} produtos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {category.products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              Nenhum produto nesta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
