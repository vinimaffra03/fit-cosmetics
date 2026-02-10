"use client";

import Link from "next/link";
import { ArrowLeft, User, MapPin, Star, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OrderStatusBadge } from "@/components/admin/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface CustomerDetailProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    cpf: string | null;
    createdAt: string;
    totalSpent: number;
    orderCount: number;
    orders: {
      id: string;
      orderNumber: string;
      status: string;
      total: number;
      createdAt: string;
    }[];
    addresses: {
      id: string;
      label: string | null;
      street: string;
      number: string;
      complement: string | null;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
      isDefault: boolean;
    }[];
    reviews: {
      id: string;
      productName: string;
      rating: number;
      comment: string | null;
      isApproved: boolean;
      createdAt: string;
    }[];
  };
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const avgOrder =
    customer.orderCount > 0
      ? customer.totalSpent / customer.orderCount
      : 0;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/clientes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Detalhe do Cliente</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{customer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {customer.email}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {customer.phone && (
                <p>
                  <span className="text-muted-foreground">Telefone: </span>
                  {customer.phone}
                </p>
              )}
              {customer.cpf && (
                <p>
                  <span className="text-muted-foreground">CPF: </span>
                  {customer.cpf}
                </p>
              )}
              <p>
                <span className="text-muted-foreground">Cadastro: </span>
                {formatDate(new Date(customer.createdAt))}
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{customer.orderCount}</p>
              <p className="text-xs text-muted-foreground">Pedidos</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-lg font-bold">
                {formatCurrency(customer.totalSpent)}
              </p>
              <p className="text-xs text-muted-foreground">Total</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-lg font-bold">{formatCurrency(avgOrder)}</p>
              <p className="text-xs text-muted-foreground">Ticket Medio</p>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Historico de Pedidos
            </h3>
            {customer.orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum pedido.</p>
            ) : (
              <div className="space-y-3">
                {customer.orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/pedidos/${order.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <span className="font-mono text-xs">
                        #{order.orderNumber.slice(0, 8)}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(order.createdAt))}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order.status} />
                      <span className="font-medium">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {customer.addresses.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Enderecos
              </h3>
              <div className="grid gap-3">
                {customer.addresses.map((addr) => (
                  <div key={addr.id} className="p-3 rounded-lg border text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {addr.label || "Endereco"}
                      </span>
                      {addr.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Padrao
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {addr.street}, {addr.number}
                      {addr.complement && ` - ${addr.complement}`}
                    </p>
                    <p className="text-muted-foreground">
                      {addr.neighborhood}, {addr.city} - {addr.state}
                    </p>
                    <p className="text-muted-foreground">
                      CEP: {addr.zipCode}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {customer.reviews.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Star className="h-4 w-4" /> Avaliacoes
              </h3>
              <div className="space-y-3">
                {customer.reviews.map((review) => (
                  <div key={review.id} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        {review.productName}
                      </span>
                      <Badge
                        variant={review.isApproved ? "default" : "secondary"}
                      >
                        {review.isApproved ? "Aprovada" : "Pendente"}
                      </Badge>
                    </div>
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
