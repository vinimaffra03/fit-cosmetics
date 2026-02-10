import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { storeSettingsSchema } from "@/lib/validations/admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const settings = await prisma.storeSettings.findFirst();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = storeSettingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const d = parsed.data;
    const settingsData = {
      storeName: d.storeName!,
      storeEmail: d.storeEmail!,
      storePhone: d.storePhone,
      storeWhatsapp: d.storeWhatsapp,
      logoUrl: d.logoUrl,
      faviconUrl: d.faviconUrl,
      freeShippingMin: d.freeShippingMin!,
      maxInstallments: d.maxInstallments!,
      minInstallmentValue: d.minInstallmentValue!,
      metaTitle: d.metaTitle,
      metaDescription: d.metaDescription,
      socialInstagram: d.socialInstagram,
      socialFacebook: d.socialFacebook,
      socialWhatsapp: d.socialWhatsapp,
    };
    const settings = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: settingsData,
      create: { id: "default", ...settingsData },
    });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Erro ao salvar configuracoes" },
      { status: 500 }
    );
  }
}
