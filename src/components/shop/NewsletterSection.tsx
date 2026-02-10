"use client";

import { useState } from "react";
import { Send, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor, insira seu e-mail");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Cadastro realizado com sucesso!", {
      description: "Você receberá seu cupom de 10% por e-mail.",
    });

    setEmail("");
    setLoading(false);
  };

  return (
    <section className="bg-cream py-16 lg:py-20">
      <div className="container-shop">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full text-sm text-primary mb-6">
            <Gift className="h-4 w-4" />
            <span>Ganhe 10% de desconto</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-semibold">
            Receba Ofertas Exclusivas
          </h2>
          <p className="mt-3 text-muted-foreground">
            Cadastre-se e ganhe 10% OFF na primeira compra, além de dicas de
            cuidados capilares.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              className="input-shop flex-1"
              disabled={loading}
            />
            <Button
              type="submit"
              className="btn-primary px-6"
              disabled={loading}
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Cadastrar
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Ao se cadastrar, você concorda com nossa{" "}
            <a
              href="/privacidade"
              className="underline hover:text-primary"
            >
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
