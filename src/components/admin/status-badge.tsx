"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const orderStatusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100" },
  CONFIRMED: { label: "Confirmado", className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100" },
  PROCESSING: { label: "Em preparo", className: "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100" },
  SHIPPED: { label: "Enviado", className: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100" },
  DELIVERED: { label: "Entregue", className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" },
  CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100" },
  REFUNDED: { label: "Reembolsado", className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100" },
};

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100" },
  PROCESSING: { label: "Processando", className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100" },
  PAID: { label: "Pago", className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" },
  FAILED: { label: "Falhou", className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100" },
  REFUNDED: { label: "Reembolsado", className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100" },
  CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100" },
};

const paymentMethodConfig: Record<string, { label: string }> = {
  PIX: { label: "PIX" },
  CREDIT_CARD: { label: "Cartao" },
  BOLETO: { label: "Boleto" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = orderStatusConfig[status] || { label: status, className: "" };
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const config = paymentStatusConfig[status] || { label: status, className: "" };
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

export function PaymentMethodBadge({ method }: { method: string }) {
  const config = paymentMethodConfig[method] || { label: method };
  return (
    <Badge variant="secondary" className="font-medium">
      {config.label}
    </Badge>
  );
}
