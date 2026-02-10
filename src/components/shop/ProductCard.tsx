"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star, Heart, Truck } from "lucide-react";
import { useCartStore, CartProduct } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    images: { url: string; alt?: string | null }[];
    category?: { name: string; slug: string } | null;
    stock: number;
    rating: number;
    reviewCount: number;
    isNew: boolean;
    isFeatured: boolean;
  };
  className?: string;
}

export default function ProductCard({
  product,
  className = "",
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const imageUrl = product.images?.[0]?.url || "/images/product-progressiva-gold.jpg";

  const handleAddToCart = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    setIsAdding(true);
    try {
      const cartProduct: CartProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.compareAtPrice ?? undefined,
        image: imageUrl,
        stock: product.stock,
      };
      addItem(cartProduct);
      toast.success(`${product.name} adicionado ao carrinho!`);
    } catch {
      toast.error("Erro ao adicionar ao carrinho");
    } finally {
      setIsAdding(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos"
    );
  };

  return (
    <article className={`card-product group ${className}`}>
      <Link
        href={`/produto/${product.slug}`}
        className="block relative overflow-hidden"
      >
        <div className="aspect-square bg-muted relative">
          <Image
            src={imageUrl}
            alt={product.images?.[0]?.alt || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge variant="default" className="text-xs">
              Novo
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" className="text-xs">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite();
          }}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-current text-red-500" : ""}`}
          />
        </Button>

        {/* Quick Add - Desktop */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full btn-primary gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            {isAdding ? "Adicionando..." : "Adicionar"}
          </Button>
        </div>
      </Link>

      <div className="p-4">
        {product.category && (
          <Link href={`/categoria/${product.category.slug}`}>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-primary transition-colors">
              {product.category.name}
            </span>
          </Link>
        )}

        <Link href={`/produto/${product.slug}`}>
          <h3 className="font-medium mt-1 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating)
                      ? "text-gold fill-gold"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-primary">
            {formatCurrency(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center gap-1 mt-2 text-sm">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span
            className={product.stock > 0 ? "text-green-600" : "text-red-600"}
          >
            {product.stock > 0
              ? `Em estoque (${product.stock})`
              : "Fora de estoque"}
          </span>
        </div>

        {/* Mobile Add */}
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          className="w-full mt-3 btn-primary gap-2 sm:hidden"
          size="sm"
        >
          <ShoppingBag className="h-4 w-4" />
          {isAdding ? "Adicionando..." : "Adicionar"}
        </Button>
      </div>
    </article>
  );
}
