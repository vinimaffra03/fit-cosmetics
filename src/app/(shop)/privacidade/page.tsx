import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade e proteção de dados da FIT Cosmetics.",
};

export default function PrivacyPage() {
  return (
    <div className="section-padding">
      <div className="container-shop max-w-3xl mx-auto">
        <h1 className="text-4xl font-semibold mb-8">
          Política de Privacidade
        </h1>
        <div className="prose max-w-none text-muted-foreground space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. Coleta de Dados
            </h2>
            <p>
              Coletamos informações pessoais que você nos fornece diretamente,
              como nome, e-mail, telefone e endereço ao criar uma conta ou
              realizar uma compra.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. Uso das Informações
            </h2>
            <p>
              Utilizamos seus dados para processar pedidos, enviar atualizações
              sobre suas compras, melhorar nossos serviços e enviar comunicações
              de marketing (apenas com seu consentimento).
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. Proteção de Dados
            </h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais
              para proteger suas informações pessoais contra acesso não
              autorizado, alteração, divulgação ou destruição.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. Seus Direitos (LGPD)
            </h2>
            <p>
              Conforme a Lei Geral de Proteção de Dados (LGPD), você tem
              direito a acessar, corrigir, excluir seus dados pessoais e
              solicitar a portabilidade dos mesmos. Para exercer esses direitos,
              entre em contato conosco.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
