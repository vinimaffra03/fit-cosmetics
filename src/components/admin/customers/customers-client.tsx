"use client";

import Link from "next/link";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  orderCount: number;
  createdAt: string;
}

export function CustomersClient({ customers }: { customers: Customer[] }) {
  const columns: ColumnDef<Customer>[] = [
    {
      key: "name",
      header: "Cliente",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {item.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Telefone",
      cell: (item) => (
        <span className="text-sm text-muted-foreground">
          {item.phone || "-"}
        </span>
      ),
    },
    {
      key: "orderCount",
      header: "Pedidos",
      sortable: true,
      cell: (item) => <span>{item.orderCount}</span>,
    },
    {
      key: "createdAt",
      header: "Cadastro",
      sortable: true,
      cell: (item) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(new Date(item.createdAt))}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      cell: (item) => (
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href={`/admin/clientes/${item.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>
      <DataTable
        data={customers}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Buscar cliente..."
      />
    </div>
  );
}
