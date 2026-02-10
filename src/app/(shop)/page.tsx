import { Suspense } from "react";
import { Metadata } from "next";
import HeroSection from "@/components/shop/HeroSection";
import CategoriesSection from "@/components/shop/CategoriesSection";
import FeaturedProducts from "@/components/shop/FeaturedProducts";
import PromoSection from "@/components/shop/PromoSection";
import TestimonialsSection from "@/components/shop/TestimonialsSection";
import NewsletterSection from "@/components/shop/NewsletterSection";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "FIT Cosmetics - Cosméticos Profissionais para Cabelos",
  description:
    "Descubra a linha completa de progressivas, kits e produtos de manutenção capilar. Frete grátis acima de R$199. Até 12x sem juros.",
};

function ProductsSkeleton() {
  return (
    <section className="section-padding bg-muted">
      <div className="container-shop">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <PromoSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
