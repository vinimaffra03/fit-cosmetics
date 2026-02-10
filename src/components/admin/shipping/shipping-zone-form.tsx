"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  shippingZoneSchema,
  type ShippingZoneInput,
} from "@/lib/validations/admin";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface ShippingZoneFormProps {
  defaultValues?: Partial<ShippingZoneInput>;
  loading?: boolean;
  onSubmit: (data: ShippingZoneInput) => void;
  onCancel: () => void;
}

export function ShippingZoneForm({
  defaultValues,
  loading,
  onSubmit,
  onCancel,
}: ShippingZoneFormProps) {
  const form = useForm<ShippingZoneInput>({
    resolver: zodResolver(shippingZoneSchema),
    defaultValues: {
      name: "",
      zipCodeStart: "",
      zipCodeEnd: "",
      basePrice: 0,
      pricePerKg: 0,
      freeShippingMin: null,
      estimatedDays: 5,
      isActive: true,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Zona</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Sudeste" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="zipCodeStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP Inicio</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="00000-000" maxLength={9} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCodeEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP Fim</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="99999-999" maxLength={9} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preco Base (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pricePerKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preco por Kg (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="freeShippingMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frete Gratis Acima de (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Sem frete gratis"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimatedDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo Estimado (dias)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel>Zona Ativa</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Disponivel para calculo de frete
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
}
