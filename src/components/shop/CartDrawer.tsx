"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const setIsOpen = useCartStore((s) => s.setIsOpen);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display text-xl">
            <ShoppingBag className="h-5 w-5" />
            Seu Carrinho
            {totalItems > 0 && (
              <span className="text-sm font-sans font-normal text-muted-foreground">
                ({totalItems} {totalItems === 1 ? "item" : "itens"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-12">
            <div className="p-6 rounded-full bg-muted">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-lg">Seu carrinho está vazio</p>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione produtos para continuar
              </p>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              asChild
              className="mt-4"
            >
              <Link href="/produtos">Ver Produtos</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 bg-muted/50 rounded-lg animate-fade-in"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 relative">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/produto/${item.product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-primary font-semibold mt-1">
                        {formatCurrency(item.product.price)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className={totalPrice >= 199 ? "text-success" : ""}>
                    {totalPrice >= 199
                      ? "Grátis"
                      : "Calcular no checkout"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  asChild
                  className="w-full btn-primary"
                  size="lg"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/checkout">Finalizar Compra</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Continuar Comprando
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
