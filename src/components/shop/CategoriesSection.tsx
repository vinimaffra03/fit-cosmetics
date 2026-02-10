import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    slug: "progressivas",
    name: "Progressivas",
    description: "Tratamentos de alisamento profissional para todos os tipos de cabelo",
    icon: "💇‍♀️",
  },
  {
    slug: "kits",
    name: "Kits Completos",
    description: "Kits com tudo que você precisa para o tratamento perfeito",
    icon: "📦",
  },
  {
    slug: "manutencao",
    name: "Manutenção",
    description: "Produtos para manter seu cabelo liso e saudável por mais tempo",
    icon: "✨",
  },
];

export default function CategoriesSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-shop">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">
            Navegue por Categoria
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Encontre o produto perfeito para transformar seus cabelos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-card p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl sm:text-5xl mb-4">{category.icon}</div>
              <h3 className="font-display text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {category.description}
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Ver produtos
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/10 to-transparent rounded-bl-full pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
