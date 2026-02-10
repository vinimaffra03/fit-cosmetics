import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validations/admin";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const categoryId = searchParams.get("categoryId");
  const isActive = searchParams.get("isActive");

  const where: any = {};
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (categoryId) where.categoryId = categoryId;
  if (isActive !== null && isActive !== undefined && isActive !== "") {
    where.isActive = isActive === "true";
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        category: true,
        brand: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, limit });
}

export async function POST(req: NextRequest) {
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

  const d = parsed.data;
  const images = body.images as { url: string; alt?: string }[] | undefined;

  try {
    const product = await prisma.product.create({
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
        images: images?.length
          ? {
              create: images.map((img, i) => ({
                url: img.url,
                alt: img.alt || null,
                position: i,
              })),
            }
          : undefined,
      },
      include: { images: true, category: true, brand: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Slug ou SKU ja existe" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}
