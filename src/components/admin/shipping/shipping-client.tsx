"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ShippingZoneForm } from "./shipping-zone-form";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { ShippingZoneInput } from "@/lib/validations/admin";

interface ShippingZone {
  id: string;
  name: string;
  zipCodeStart: string;
  zipCodeEnd: string;
  basePrice: number;
  pricePerKg: number;
  freeShippingMin: number | null;
  estimatedDays: number;
  isActive: boolean;
}

export function ShippingClient({ zones }: { zones: ShippingZone[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [deleteZone, setDeleteZone] = useState<ShippingZone | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: ShippingZoneInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Zona de frete criada!");
      setDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("Erro ao criar zona de frete");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: ShippingZoneInput) => {
    if (!editingZone) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/shipping/${editingZone.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Zona de frete atualizada!");
      setEditingZone(null);
      router.refresh();
    } catch {
      toast.error("Erro ao atualizar zona de frete");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteZone) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/shipping/${deleteZone.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Zona de frete excluida!");
      setDeleteZone(null);
      router.refresh();
    } catch {
      toast.error("Erro ao excluir zona de frete");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<ShippingZone>[] = [
    {
      key: "name",
      header: "Nome",
      sortable: true,
      cell: (item) => <span className="font-medium">{item.name}</span>,
    },
    {
      key: "zipCodeStart",
      header: "Faixa CEP",
      cell: (item) => (
        <span className="font-mono text-sm">
          {item.zipCodeStart} - {item.zipCodeEnd}
        </span>
      ),
    },
    {
      key: "basePrice",
      header: "Preco Base",
      sortable: true,
      cell: (item) => formatCurrency(item.basePrice),
    },
    {
      key: "pricePerKg",
      header: "Por Kg",
      cell: (item) => formatCurrency(item.pricePerKg),
    },
    {
      key: "estimatedDays",
      header: "Prazo",
      cell: (item) => (
        <span>
          {item.estimatedDays} {item.estimatedDays === 1 ? "dia" : "dias"}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      cell: (item) => (
        <Badge variant={item.isActive ? "default" : "secondary"}>
          {item.isActive ? "Ativa" : "Inativa"}
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
            <DropdownMenuItem onClick={() => setEditingZone(item)}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteZone(item)}
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
        <h1 className="text-2xl font-bold">Zonas de Frete</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Zona
        </Button>
      </div>

      <DataTable
        data={zones}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Buscar zona..."
      />

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Zona de Frete</DialogTitle>
          </DialogHeader>
          <ShippingZoneForm
            loading={loading}
            onSubmit={handleCreate}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingZone}
        onOpenChange={(open) => !open && setEditingZone(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Zona de Frete</DialogTitle>
          </DialogHeader>
          {editingZone && (
            <ShippingZoneForm
              key={editingZone.id}
              defaultValues={{
                name: editingZone.name,
                zipCodeStart: editingZone.zipCodeStart,
                zipCodeEnd: editingZone.zipCodeEnd,
                basePrice: editingZone.basePrice,
                pricePerKg: editingZone.pricePerKg,
                freeShippingMin: editingZone.freeShippingMin,
                estimatedDays: editingZone.estimatedDays,
                isActive: editingZone.isActive,
              }}
              loading={loading}
              onSubmit={handleUpdate}
              onCancel={() => setEditingZone(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog
        open={!!deleteZone}
        onOpenChange={(open) => !open && setDeleteZone(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir zona de frete?</AlertDialogTitle>
            <AlertDialogDescription>
              A zona &quot;{deleteZone?.name}&quot; sera excluida permanentemente.
              Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
