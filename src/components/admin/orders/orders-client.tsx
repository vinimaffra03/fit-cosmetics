"use client";

import Link from "next/link";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { OrderStatusBadge, PaymentMethodBadge } from "@/components/admin/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  total: number;
  itemCount: number;
  paymentMethod: string | null;
  paymentStatus: string | null;
  createdAt: string;
}

export function OrdersClient({ orders }: { orders: Order[] }) {
  const columns: ColumnDef<Order>[] = [
    {
      key: "orderNumber",
      header: "Pedido",
      cell: (item) => (
        <Link
          href={`/admin/pedidos/${item.id}`}
          className="font-mono text-xs hover:underline"
        >
          #{item.orderNumber.slice(0, 8)}
        </Link>
      ),
    },
    {
      key: "customerName",
      header: "Cliente",
      sortable: true,
      cell: (item) => <span>{item.customerName}</span>,
    },
    {
      key: "createdAt",
      header: "Data",
      sortable: true,
      cell: (item) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(new Date(item.createdAt))}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item) => <OrderStatusBadge status={item.status} />,
    },
    {
      key: "paymentMethod",
      header: "Pagamento",
      cell: (item) =>
        item.paymentMethod ? (
          <PaymentMethodBadge method={item.paymentMethod} />
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        ),
    },
    {
      key: "total",
      header: "Total",
      sortable: true,
      className: "text-right",
      cell: (item) => (
        <span className="font-medium">{formatCurrency(item.total)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      cell: (item) => (
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href={`/admin/pedidos/${item.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
      <DataTable
        data={orders}
        columns={columns}
        searchKey="customerName"
        searchPlaceholder="Buscar por cliente..."
      />
    </div>
  );
}
