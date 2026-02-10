import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ana Paula Silva",
    location: "São Paulo, SP",
    rating: 5,
    text: "Simplesmente incrível! Meu cabelo nunca esteve tão liso e brilhante. A progressiva durou mais de 4 meses e o processo foi super fácil de fazer em casa.",
    product: "Progressiva Gold",
    verified: true,
  },
  {
    id: 2,
    name: "Carla Mendes",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Trabalho em salão há 15 anos e posso dizer que essa é a melhor progressiva que já usei. Minhas clientes amam o resultado e sempre voltam.",
    product: "Kit Profissional",
    verified: true,
  },
  {
    id: 3,
    name: "Fernanda Costa",
    location: "Belo Horizonte, MG",
    rating: 5,
    text: "Tinha muito medo de usar progressiva, mas essa não tem formol e deixou meu cabelo perfeito! O atendimento também foi excelente.",
    product: "Progressiva Platinum",
    verified: true,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-shop">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">
            O Que Nossas Clientes Dizem
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Milhares de clientes satisfeitas em todo Brasil
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="h-10 w-10 text-primary/30 mb-4" />

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              <p className="text-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
                {testimonial.verified && (
                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                    Compra verificada
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Produto: {testimonial.product}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-12 border-t">
          {[
            { value: "50.000+", label: "Clientes Satisfeitas" },
            { value: "4.9/5", label: "Avaliação Média" },
            { value: "10+", label: "Anos de Experiência" },
            { value: "99%", label: "Recomendam" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-3xl lg:text-4xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
