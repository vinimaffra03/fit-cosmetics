"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
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

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryName: string | null;
  image: string | null;
  createdAt: string;
}

export function ProductsClient({ products }: { products: Product[] }) {
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Produto excluido");
      router.refresh();
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      key: "image",
      header: "",
      className: "w-12",
      cell: (item) => (
        <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden relative">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
              ?
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Nome",
      sortable: true,
      cell: (item) => (
        <Link
          href={`/admin/produtos/${item.id}`}
          className="font-medium hover:underline"
        >
          {item.name}
        </Link>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      cell: (item) => (
        <span className="font-mono text-xs text-muted-foreground">
          {item.sku || "-"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Preco",
      sortable: true,
      cell: (item) => (
        <div>
          <span className="font-medium">{formatCurrency(item.price)}</span>
          {item.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through ml-1">
              {formatCurrency(item.compareAtPrice)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Estoque",
      sortable: true,
      cell: (item) => (
        <span
          className={
            item.stock === 0
              ? "text-red-600 font-medium"
              : item.stock < 5
                ? "text-yellow-600 font-medium"
                : ""
          }
        >
          {item.stock}
        </span>
      ),
    },
    {
      key: "categoryName",
      header: "Categoria",
      cell: (item) => (
        <span className="text-sm text-muted-foreground">
          {item.categoryName || "-"}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      cell: (item) => (
        <Badge variant={item.isActive ? "default" : "secondary"}>
          {item.isActive ? "Ativo" : "Inativo"}
        </Badge>
      ),
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
              <Link href={`/admin/produtos/${item.id}`}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(item.id, item.name)}
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
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button asChild>
          <Link href="/admin/produtos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Link>
        </Button>
      </div>
      <DataTable
        data={products}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Buscar produto..."
      />
    </div>
  );
}
