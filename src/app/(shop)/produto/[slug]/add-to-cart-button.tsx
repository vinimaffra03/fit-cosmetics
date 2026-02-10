"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { useCartStore, CartProduct } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: CartProduct;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setIsOpen);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      addItem(product, quantity);
      toast.success(`${product.name} adicionado ao carrinho!`, {
        description: `Quantidade: ${quantity}`,
        action: {
          label: "Ver carrinho",
          onClick: () => setCartOpen(true),
        },
      });
    } catch {
      toast.error("Erro ao adicionar ao carrinho");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center border rounded-lg">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12"
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          disabled={quantity >= product.stock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Add Button */}
      <Button
        onClick={handleAdd}
        disabled={isAdding || product.stock === 0}
        className="flex-1 btn-primary gap-2 h-12 text-base"
        size="lg"
      >
        <ShoppingBag className="h-5 w-5" />
        {product.stock === 0
          ? "Fora de Estoque"
          : isAdding
            ? "Adicionando..."
            : "Adicionar ao Carrinho"}
      </Button>
    </div>
  );
}
