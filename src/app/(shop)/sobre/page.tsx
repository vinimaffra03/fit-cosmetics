import { Metadata } from "next";
import { Star, Heart, Shield, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "Conheça a história da FIT Cosmetics. Mais de 10 anos transformando cabelos com produtos profissionais de alta qualidade.",
};

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container-shop max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold">
            Sobre a FIT Cosmetics
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Há mais de 10 anos transformando cabelos com produtos profissionais
            de alta qualidade.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-card rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Nossa História
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A FIT Cosmetics nasceu da paixão por cabelos bonitos e saudáveis.
              Fundada em São Paulo, começamos como um pequeno laboratório
              dedicado a desenvolver fórmulas inovadoras para tratamento capilar.
              Hoje, somos referência nacional em progressivas e produtos de
              manutenção, atendendo milhares de profissionais e consumidores em
              todo o Brasil.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {[
              {
                icon: Star,
                title: "Qualidade Premium",
                desc: "Produtos desenvolvidos com tecnologia de ponta e ingredientes selecionados.",
              },
              {
                icon: Heart,
                title: "Cuidado Genuíno",
                desc: "Fórmulas sem formol, seguras e testadas dermatologicamente.",
              },
              {
                icon: Shield,
                title: "Confiança",
                desc: "Mais de 50.000 clientes satisfeitas em todo o Brasil.",
              },
              {
                icon: Truck,
                title: "Praticidade",
                desc: "Entrega rápida para todo o Brasil com frete grátis acima de R$199.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl p-6">
                <item.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
