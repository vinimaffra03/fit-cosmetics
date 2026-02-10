import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validations/admin";
import { deleteImage } from "@/lib/supabase-storage";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      brand: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Produto nao encontrado" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const images = body.images as
    | { url: string; alt?: string; id?: string }[]
    | undefined;

  try {
    const product = await prisma.$transaction(async (tx) => {
      if (images) {
        const existing = await tx.productImage.findMany({
          where: { productId: params.id },
        });

        const incomingUrls = new Set(images.map((i) => i.url));
        const toDelete = existing.filter((img) => !incomingUrls.has(img.url));

        for (const img of toDelete) {
          try {
            await deleteImage(img.url);
          } catch {}
          await tx.productImage.delete({ where: { id: img.id } });
        }

        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          if (img.id) {
            await tx.productImage.update({
              where: { id: img.id },
              data: { position: i, alt: img.alt || null },
            });
          } else {
            await tx.productImage.create({
              data: {
                productId: params.id,
                url: img.url,
                alt: img.alt || null,
                position: i,
              },
            });
          }
        }
      }

      const d = parsed.data;
      return tx.product.update({
        where: { id: params.id },
        data: {
          name: d.name!,
          slug: d.slug!,
          description: d.description!,
          shortDescription: d.shortDescription,
          price: d.price!,
          compareAtPrice: d.compareAtPrice,
          sku: d.sku,
          stock: d.stock!,
          weight: d.weight,
          width: d.width,
          height: d.height,
          length: d.length,
          categoryId: d.categoryId ?? undefined,
          brandId: d.brandId ?? undefined,
          metaTitle: d.metaTitle,
          metaDescription: d.metaDescription,
          isActive: d.isActive ?? true,
          isFeatured: d.isFeatured ?? false,
          isNew: d.isNew ?? false,
          benefits: d.benefits ?? [],
          howToUse: d.howToUse,
          composition: d.composition,
        },
        include: {
          images: { orderBy: { position: "asc" } },
          category: true,
          brand: true,
        },
      });
    });

    return NextResponse.json(product);
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Slug ou SKU ja existe" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const images = await prisma.productImage.findMany({
      where: { productId: params.id },
    });

    for (const img of images) {
      try {
        await deleteImage(img.url);
      } catch {}
    }

    await prisma.product.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao excluir produto" },
      { status: 500 }
    );
  }
}
