"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  startsAt: string;
  expiresAt: string | null;
  orderCount: number;
}

const typeLabels: Record<string, string> = {
  PERCENTAGE: "Percentual",
  FIXED: "Valor Fixo",
  FREE_SHIPPING: "Frete Gratis",
};

function formatDiscount(type: string, value: number) {
  if (type === "PERCENTAGE") return `${value}%`;
  if (type === "FREE_SHIPPING") return "Frete Gratis";
  return formatCurrency(value);
}

function getCouponStatus(coupon: Coupon): { label: string; variant: "default" | "secondary" | "destructive" } {
  if (!coupon.isActive) return { label: "Inativo", variant: "secondary" };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
    return { label: "Expirado", variant: "destructive" };
  return { label: "Ativo", variant: "default" };
}

export function CouponsClient({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Excluir cupom "${code}"?`)) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Cupom excluido");
      router.refresh();
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  const columns: ColumnDef<Coupon>[] = [
    {
      key: "code",
      header: "Codigo",
      sortable: true,
      cell: (item) => (
        <span className="font-mono font-bold">{item.code}</span>
      ),
    },
    {
      key: "discountType",
      header: "Tipo",
      cell: (item) => (
        <Badge variant="outline">{typeLabels[item.discountType]}</Badge>
      ),
    },
    {
      key: "discountValue",
      header: "Desconto",
      cell: (item) => (
        <span className="font-medium">
          {formatDiscount(item.discountType, item.discountValue)}
        </span>
      ),
    },
    {
      key: "usageCount",
      header: "Uso",
      cell: (item) => (
        <span>
          {item.usageCount}
          {item.usageLimit ? ` / ${item.usageLimit}` : " / Ilimitado"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item) => {
        const status = getCouponStatus(item);
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/cupons/${item.id}`}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(item.id, item.code)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Cupons</h1>
        <Button asChild>
          <Link href="/admin/cupons/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cupom
          </Link>
        </Button>
      </div>
      <DataTable
        data={coupons}
        columns={columns}
        searchKey="code"
        searchPlaceholder="Buscar cupom..."
      />
    </div>
  );
}
