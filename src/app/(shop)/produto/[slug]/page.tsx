import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Star, Truck, Shield, ArrowLeft } from "lucide-react";
import AddToCartButton from "./add-to-cart-button";

interface ProductPageProps {
  params: { slug: string };
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      brand: true,
    },
  });
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: product.images.map((img) => ({ url: img.url })),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const mainImage = product.images[0]?.url || "/images/product-progressiva-gold.jpg";

  return (
    <div className="section-padding">
      <div className="container-shop">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Início
          </Link>
          <span>/</span>
          <Link
            href="/produtos"
            className="hover:text-primary transition-colors"
          >
            Produtos
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/categoria/${product.category.slug}`}
                className="hover:text-primary transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden relative">
              <Image
                src={mainImage}
                alt={product.images[0]?.alt || product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Novo
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                  -{discount}%
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <div
                    key={img.id}
                    className="aspect-square bg-muted rounded-lg overflow-hidden relative cursor-pointer border-2 border-transparent hover:border-primary transition-colors"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.brand && (
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {product.brand.name}
              </p>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold mt-2">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} avaliações)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              ou até 12x de {formatCurrency(product.price / 12)} sem juros
            </p>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="mt-6 text-muted-foreground leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Add to Cart */}
            <div className="mt-8">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  originalPrice: product.compareAtPrice ?? undefined,
                  image: mainImage,
                  stock: product.stock,
                }}
              />
            </div>

            {/* Trust */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-success" />
                <span>
                  {product.price >= 199
                    ? "Frete grátis para todo Brasil"
                    : "Frete grátis acima de R$ 199"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-success" />
                <span>Compra segura - Pagamento protegido</span>
              </div>
            </div>

            {/* Benefits */}
            {product.benefits.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-3">Benefícios</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold text-lg mb-3">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* How to Use */}
            {product.howToUse && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold text-lg mb-3">
                  Modo de Uso
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.howToUse}
                </p>
              </div>
            )}

            {/* Composition */}
            {product.composition && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold text-lg mb-3">Composição</h3>
                <p className="text-sm text-muted-foreground">
                  {product.composition}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
