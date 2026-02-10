"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  Search,
  ChevronDown,
  User,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CartDrawer from "@/components/shop/CartDrawer";

const categories = [
  { name: "Progressivas", slug: "progressivas" },
  { name: "Kits Completos", slug: "kits" },
  { name: "Manutenção", slug: "manutencao" },
];

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const totalItems = useCartStore((s) => s.totalItems());
  const setCartOpen = useCartStore((s) => s.setIsOpen);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {/* Top Bar */}
        <div className="bg-secondary text-secondary-foreground">
          <div className="container-shop">
            <div className="flex h-9 items-center justify-center text-xs sm:text-sm">
              <span className="animate-fade-in">
                <strong>FRETE GRÁTIS</strong> em compras acima de R$ 199
                | Parcele em até <strong>12x sem juros</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container-shop">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        isActive(link.href)
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t pt-4 mt-2">
                    <p className="text-sm font-semibold text-muted-foreground mb-3">
                      Categorias
                    </p>
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/categoria/${category.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-foreground hover:text-primary transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-bold text-foreground tracking-wide">
                  FIT
                </span>
                <span className="text-[10px] sm:text-xs tracking-[0.3em] text-primary font-medium -mt-1">
                  GOLD BEAUTY
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors link-underline ${
                  isActive("/")
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                Início
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                    Produtos
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-48 animate-slide-down"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/produtos" className="cursor-pointer">
                      Todos os Produtos
                    </Link>
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.slug} asChild>
                      <Link
                        href={`/categoria/${category.slug}`}
                        className="cursor-pointer"
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/sobre"
                className={`text-sm font-medium transition-colors link-underline ${
                  isActive("/sobre")
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                Sobre
              </Link>
              <Link
                href="/contato"
                className={`text-sm font-medium transition-colors link-underline ${
                  isActive("/contato")
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                Contato
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-5 w-5" />
                <span className="sr-only">Buscar</span>
              </Button>

              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Conta</span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-scale-in">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Carrinho</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}
