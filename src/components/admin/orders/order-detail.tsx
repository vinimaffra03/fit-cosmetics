"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, Package, MapPin, CreditCard, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  PaymentMethodBadge,
} from "@/components/admin/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface OrderDetailProps {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    subtotal: number;
    discount: number;
    shippingCost: number;
    total: number;
    notes: string | null;
    trackingNumber: string | null;
    trackingUrl: string | null;
    createdAt: string;
    customer: {
      name: string;
      email: string;
      phone: string | null;
      cpf: string | null;
    };
    address: {
      street: string;
      number: string;
      complement: string | null;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    } | null;
    items: {
      id: string;
      productName: string;
      productImage: string | null;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[];
    payment: {
      method: string;
      status: string;
      amount: number;
      externalId: string | null;
      cardLastFour: string | null;
      cardBrand: string | null;
      installments: number;
      pixCode: string | null;
      paidAt: string | null;
    } | null;
    coupon: {
      code: string;
      discountType: string;
      discountValue: number;
    } | null;
  };
}

const statusOptions = [
  { value: "PENDING", label: "Pendente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "PROCESSING", label: "Em preparo" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED", label: "Reembolsado" },
];

export function OrderDetail({ order }: OrderDetailProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber ?? ""
  );
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl ?? "");
  const [notes, setNotes] = useState(order.notes ?? "");

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber, trackingUrl, notes }),
      });
      if (!res.ok) throw new Error();
      toast.success("Pedido atualizado!");
      router.refresh();
    } catch {
      toast.error("Erro ao atualizar pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/pedidos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            Pedido #{order.orderNumber.slice(0, 8)}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(new Date(order.createdAt))}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="h-4 w-4" /> Itens do Pedido
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Qtd</TableHead>
                  <TableHead className="text-right">Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.productImage && (
                          <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden relative shrink-0">
                            <Image
                              src={item.productImage}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        )}
                        <span className="font-medium">{item.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.totalPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 border-t pt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Desconto
                    {order.coupon && ` (${order.coupon.code})`}
                  </span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span>
                  {order.shippingCost === 0
                    ? "Gratis"
                    : formatCurrency(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Atualizar Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Codigo de Rastreio</Label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ex: BR123456789"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>URL de Rastreio</Label>
                <Input
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Observacoes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <Button onClick={handleUpdate} disabled={loading} className="mt-4">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Atualizar Pedido
            </Button>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" /> Cliente
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-muted-foreground">{order.customer.email}</p>
              {order.customer.phone && (
                <p className="text-muted-foreground">{order.customer.phone}</p>
              )}
              {order.customer.cpf && (
                <p className="text-muted-foreground">
                  CPF: {order.customer.cpf}
                </p>
              )}
            </div>
          </Card>

          {order.address && (
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Endereco
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  {order.address.street}, {order.address.number}
                </p>
                {order.address.complement && <p>{order.address.complement}</p>}
                <p>{order.address.neighborhood}</p>
                <p>
                  {order.address.city} - {order.address.state}
                </p>
                <p>CEP: {order.address.zipCode}</p>
              </div>
            </Card>
          )}

          {order.payment && (
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Pagamento
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <PaymentMethodBadge method={order.payment.method} />
                  <PaymentStatusBadge status={order.payment.status} />
                </div>
                <p>{formatCurrency(order.payment.amount)}</p>
                {order.payment.cardLastFour && (
                  <p className="text-muted-foreground">
                    {order.payment.cardBrand} **** {order.payment.cardLastFour}
                    {order.payment.installments > 1 &&
                      ` (${order.payment.installments}x)`}
                  </p>
                )}
                {order.payment.externalId && (
                  <p className="text-muted-foreground text-xs font-mono">
                    ID: {order.payment.externalId}
                  </p>
                )}
                {order.payment.paidAt && (
                  <p className="text-muted-foreground">
                    Pago em: {formatDate(new Date(order.payment.paidAt))}
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
