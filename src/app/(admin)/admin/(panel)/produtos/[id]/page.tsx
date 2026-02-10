import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/products/product-form";

export const metadata: Metadata = {
  title: "Editar Produto | Admin",
};

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) notFound();

  const defaultValues = {
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription ?? "",
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    sku: product.sku ?? "",
    stock: product.stock,
    weight: product.weight,
    width: product.width,
    height: product.height,
    length: product.length,
    categoryId: product.categoryId ?? "",
    brandId: product.brandId ?? "",
    metaTitle: product.metaTitle ?? "",
    metaDescription: product.metaDescription ?? "",
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    benefits: product.benefits,
    howToUse: product.howToUse ?? "",
    composition: product.composition ?? "",
  };

  const images = product.images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt ?? "",
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Produto</h1>
      <ProductForm
        productId={product.id}
        defaultValues={defaultValues}
        defaultImages={images}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        brands={brands.map((b) => ({ id: b.id, name: b.name }))}
      />
    </div>
  );
}
