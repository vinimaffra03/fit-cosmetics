"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);

  const shipping = totalPrice >= 199 ? 0 : 19.9;
  const total = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="section-padding">
        <div className="container-shop max-w-2xl mx-auto text-center">
          <div className="p-8 rounded-full bg-muted w-fit mx-auto mb-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="font-display text-3xl font-semibold">
            Seu carrinho está vazio
          </h1>
          <p className="mt-3 text-muted-foreground">
            Adicione produtos para continuar comprando
          </p>
          <Button asChild className="mt-8 btn-primary" size="lg">
            <Link href="/produtos">Ver Produtos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-shop">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-semibold">
            Meu Carrinho
          </h1>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            Limpar carrinho
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 bg-card rounded-xl"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0 relative">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/produto/${item.product.slug}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-primary font-semibold mt-1">
                    {formatCurrency(item.product.price)}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
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
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        {formatCurrency(
                          item.product.price * item.quantity
                        )}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-xl p-6 h-fit sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Resumo do Pedido</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className={shipping === 0 ? "text-success" : ""}>
                  {shipping === 0 ? "Grátis" : formatCurrency(shipping)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <Button asChild className="w-full mt-6 btn-primary" size="lg">
              <Link href="/checkout">Finalizar Compra</Link>
            </Button>

            <Button asChild variant="outline" className="w-full mt-3">
              <Link href="/produtos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continuar Comprando
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
