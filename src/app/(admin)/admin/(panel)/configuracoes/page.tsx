import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings/settings-form";

export const metadata: Metadata = {
  title: "Configuracoes | Admin",
};

export default async function SettingsPage() {
  const settings = await prisma.storeSettings.findFirst();

  const defaultValues = settings
    ? {
        storeName: settings.storeName,
        storeEmail: settings.storeEmail,
        storePhone: settings.storePhone ?? "",
        storeWhatsapp: settings.storeWhatsapp ?? "",
        logoUrl: settings.logoUrl ?? "",
        faviconUrl: settings.faviconUrl ?? "",
        freeShippingMin: settings.freeShippingMin,
        maxInstallments: settings.maxInstallments,
        minInstallmentValue: settings.minInstallmentValue,
        metaTitle: settings.metaTitle ?? "",
        metaDescription: settings.metaDescription ?? "",
        socialInstagram: settings.socialInstagram ?? "",
        socialFacebook: settings.socialFacebook ?? "",
        socialWhatsapp: settings.socialWhatsapp ?? "",
      }
    : undefined;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configuracoes da Loja</h1>
      <SettingsForm defaultValues={defaultValues} />
    </div>
  );
}
