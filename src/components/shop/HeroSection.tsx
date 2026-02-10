import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-cream-dark">
      <div className="container-shop">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-20">
          {/* Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full text-sm text-primary mb-6 animate-fade-in">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span>Mais de 50.000 clientes satisfeitos</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-balance animate-slide-up">
              Cabelos{" "}
              <span className="text-primary">Lisos e Brilhantes</span> Como
              Você Sempre Sonhou
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 animate-slide-up [animation-delay:0.1s]">
              Produtos profissionais de progressiva capilar com tecnologia de
              ponta. Resultados duradouros, fórmulas seguras, entrega para
              todo Brasil.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start animate-slide-up [animation-delay:0.2s]">
              <Button
                asChild
                size="lg"
                className="btn-primary text-base px-8"
              >
                <Link href="/produtos">
                  Ver Produtos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="btn-outline-gold text-base px-8"
              >
                <Link href="/sobre">Conheça Nossa História</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start animate-slide-up [animation-delay:0.3s]">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5 text-success" />
                <span className="text-muted-foreground">Sem Formol</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-5 w-5 text-success" />
                <span className="text-muted-foreground">
                  Frete Grátis +R$199
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-5 w-5 text-gold fill-gold" />
                <span className="text-muted-foreground">
                  4.9/5 Avaliação
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2 relative animate-fade-in">
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-rose/20 rounded-3xl transform rotate-3" />
              <div className="absolute inset-0 bg-card rounded-3xl shadow-xl overflow-hidden">
                <Image
                  src="/images/hero-woman.jpg"
                  alt="Mulher com cabelo liso e brilhante após tratamento de progressiva"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-4 -left-4 sm:bottom-8 sm:-left-8 bg-card p-4 rounded-xl shadow-lg animate-slide-up [animation-delay:0.4s]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/20 rounded-full">
                    <Star className="h-5 w-5 text-success fill-success" />
                  </div>
                  <div>
                    <p className="font-semibold">847 Avaliações</p>
                    <p className="text-sm text-muted-foreground">
                      Nota 4.9/5
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
