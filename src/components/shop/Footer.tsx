import Link from "next/link";
import {
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  Shield,
  Truck,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Trust Bar */}
      <div className="border-b border-charcoal-light/20">
        <div className="container-shop py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 rounded-full bg-gold/20">
                <Truck className="h-6 w-6 text-gold-light" />
              </div>
              <div>
                <p className="font-medium">Frete Grátis</p>
                <p className="text-sm text-muted-foreground">
                  Acima de R$ 199
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <div className="p-3 rounded-full bg-gold/20">
                <CreditCard className="h-6 w-6 text-gold-light" />
              </div>
              <div>
                <p className="font-medium">Parcelamento</p>
                <p className="text-sm text-muted-foreground">
                  Até 12x sem juros
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-end">
              <div className="p-3 rounded-full bg-gold/20">
                <Shield className="h-6 w-6 text-gold-light" />
              </div>
              <div>
                <p className="font-medium">Compra Segura</p>
                <p className="text-sm text-muted-foreground">
                  Ambiente protegido
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-shop py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <span className="font-display text-2xl font-semibold text-white tracking-wide">
                FIT
              </span>
              <span className="block text-xs tracking-[0.3em] text-gold-light font-medium">
                GOLD BEAUTY
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Há mais de 10 anos transformando cabelos com produtos de alta
              qualidade. Sua confiança é nosso maior patrimônio.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-charcoal-light/50 hover:bg-gold transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-charcoal-light/50 hover:bg-gold transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-charcoal-light/50 hover:bg-gold transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Menu</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Início" },
                { href: "/produtos", label: "Produtos" },
                { href: "/sobre", label: "Sobre Nós" },
                { href: "/contato", label: "Contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-white mb-4">Atendimento</h3>
            <ul className="space-y-2">
              {[
                { href: "/contato", label: "Fale Conosco" },
                { href: "/termos", label: "Termos de Uso" },
                { href: "/privacidade", label: "Política de Privacidade" },
                { href: "/login", label: "Minha Conta" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gold-light mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    (11) 99999-9999
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Seg a Sex, 9h às 18h
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gold-light mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  contato@fitcosmetics.com.br
                </p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold-light mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  São Paulo, SP
                  <br />
                  Brasil
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-charcoal-light/20">
        <div className="container-shop py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} FIT Cosmetics. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-2">
                Pagamento:
              </span>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-charcoal-light/50 rounded text-xs">
                  PIX
                </div>
                <div className="px-2 py-1 bg-charcoal-light/50 rounded text-xs">
                  Visa
                </div>
                <div className="px-2 py-1 bg-charcoal-light/50 rounded text-xs">
                  Master
                </div>
                <div className="px-2 py-1 bg-charcoal-light/50 rounded text-xs">
                  Boleto
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
