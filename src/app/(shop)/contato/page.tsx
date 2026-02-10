"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Mensagem enviada com sucesso!", {
      description: "Retornaremos em até 24 horas.",
    });
    setLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="section-padding">
      <div className="container-shop max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-semibold">
            Fale Conosco
          </h1>
          <p className="mt-3 text-muted-foreground">
            Estamos aqui para ajudar. Envie sua mensagem!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[
              {
                icon: Phone,
                title: "Telefone",
                detail: "(11) 99999-9999",
                sub: "Seg a Sex, 9h às 18h",
              },
              {
                icon: Mail,
                title: "E-mail",
                detail: "contato@fitcosmetics.com.br",
                sub: "Resposta em até 24h",
              },
              {
                icon: MapPin,
                title: "Endereço",
                detail: "São Paulo, SP",
                sub: "Brasil",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 bg-card rounded-xl p-4"
              >
                <div className="p-3 rounded-full bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.detail}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl p-6 space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu nome" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <textarea
                id="message"
                rows={4}
                className="input-shop resize-none"
                placeholder="Sua mensagem..."
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensagem
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
