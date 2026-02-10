import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="font-display text-6xl font-bold text-primary">404</h1>
        <h2 className="font-display text-2xl font-semibold mt-4">
          Página não encontrada
        </h2>
        <p className="mt-3 text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild className="mt-8 btn-primary" size="lg">
          <Link href="/">Voltar ao Início</Link>
        </Button>
      </div>
    </div>
  );
}
