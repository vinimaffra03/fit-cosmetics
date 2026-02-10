import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PromoSection() {
  return (
    <section className="relative overflow-hidden bg-gray-900 text-white py-16 lg:py-24">
      <div className="container-shop">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-sm text-primary mb-6">
              <Clock className="h-4 w-4" />
              <span>Oferta por tempo limitado</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Até <span className="text-primary">40% OFF</span> em Kits
              Selecionados
            </h2>

            <p className="mt-6 text-lg text-gray-400 max-w-lg mx-auto lg:mx-0">
              Aproveite condições especiais nos kits mais completos.
              Economize e tenha tudo que precisa para um tratamento
              profissional.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8"
              >
                <Link href="/produtos">
                  Ver Promoções
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto lg:max-w-none relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-200/20 rounded-3xl transform -rotate-3" />
              <div className="absolute inset-0 bg-gray-800 rounded-3xl overflow-hidden">
                <Image
                  src="/images/product-kit.jpg"
                  alt="Kit de produtos em promoção"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -top-4 -right-4 sm:top-4 sm:-right-8 bg-primary text-primary-foreground p-4 rounded-full shadow-lg animate-pulse">
                <div className="text-center">
                  <Sparkles className="h-6 w-6 mx-auto" />
                  <p className="text-lg font-bold mt-1">40%</p>
                  <p className="text-xs font-medium">OFF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
