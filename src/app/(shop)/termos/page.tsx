import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso do site FIT Cosmetics.",
};

export default function TermsPage() {
  return (
    <div className="section-padding">
      <div className="container-shop max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-semibold mb-8">
          Termos de Uso
        </h1>
        <div className="prose max-w-none text-muted-foreground space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao acessar e usar o site FIT Cosmetics, você concorda com estes
              termos de uso. Se não concordar com qualquer parte destes termos,
              não utilize nosso site.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. Produtos e Preços
            </h2>
            <p>
              Os preços dos produtos estão sujeitos a alterações sem aviso
              prévio. Nos reservamos o direito de modificar ou descontinuar
              qualquer produto a qualquer momento.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. Política de Troca e Devolução
            </h2>
            <p>
              Aceitamos devoluções em até 7 dias após o recebimento do produto,
              conforme o Código de Defesa do Consumidor. O produto deve estar
              lacrado e em sua embalagem original.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. Responsabilidades
            </h2>
            <p>
              Os produtos devem ser utilizados conforme as instruções fornecidas.
              Não nos responsabilizamos pelo uso inadequado dos produtos.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
