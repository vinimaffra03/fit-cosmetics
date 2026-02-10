import { z } from "zod";

// ==========================================
// Product
// ==========================================
export const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  slug: z
    .string()
    .min(3, "Slug deve ter pelo menos 3 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug deve conter apenas letras minusculas, numeros e hifens"
    ),
  description: z.string().min(10, "Descricao deve ter pelo menos 10 caracteres"),
  shortDescription: z.string().optional().nullable(),
  price: z.coerce.number().positive("Preco deve ser maior que zero"),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.coerce.number().int().min(0, "Estoque nao pode ser negativo"),
  weight: z.coerce.number().positive().optional().nullable(),
  width: z.coerce.number().positive().optional().nullable(),
  height: z.coerce.number().positive().optional().nullable(),
  length: z.coerce.number().positive().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  benefits: z.array(z.string()).default([]),
  howToUse: z.string().optional().nullable(),
  composition: z.string().optional().nullable(),
});
export type ProductInput = z.infer<typeof productSchema>;

// ==========================================
// Coupon
// ==========================================
export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Codigo deve ter pelo menos 3 caracteres")
    .transform((v) => v.toUpperCase()),
  description: z.string().optional().nullable(),
  discountType: z.enum(["PERCENTAGE", "FIXED", "FREE_SHIPPING"]),
  discountValue: z.coerce.number().min(0, "Valor do desconto invalido"),
  minPurchase: z.coerce.number().min(0).optional().nullable(),
  maxDiscount: z.coerce.number().min(0).optional().nullable(),
  usageLimit: z.coerce.number().int().min(0).optional().nullable(),
  isActive: z.boolean().default(true),
  startsAt: z.coerce.date(),
  expiresAt: z.coerce.date().optional().nullable(),
});
export type CouponInput = z.infer<typeof couponSchema>;

// ==========================================
// Order Status Update
// ==========================================
export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
  trackingNumber: z.string().optional().nullable(),
  trackingUrl: z
    .string()
    .url("URL invalida")
    .optional()
    .nullable()
    .or(z.literal("")),
  notes: z.string().optional().nullable(),
});
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;

// ==========================================
// Store Settings
// ==========================================
export const storeSettingsSchema = z.object({
  storeName: z.string().min(2, "Nome da loja obrigatorio"),
  storeEmail: z.string().email("E-mail invalido"),
  storePhone: z.string().optional().nullable(),
  storeWhatsapp: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  freeShippingMin: z.coerce.number().min(0),
  maxInstallments: z.coerce.number().int().min(1).max(12),
  minInstallmentValue: z.coerce.number().min(1),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  socialInstagram: z.string().optional().nullable(),
  socialFacebook: z.string().optional().nullable(),
  socialWhatsapp: z.string().optional().nullable(),
});
export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;

// ==========================================
// Shipping Zone
// ==========================================
export const shippingZoneSchema = z.object({
  name: z.string().min(2, "Nome obrigatorio"),
  zipCodeStart: z.string().min(8, "CEP invalido"),
  zipCodeEnd: z.string().min(8, "CEP invalido"),
  basePrice: z.coerce.number().min(0),
  pricePerKg: z.coerce.number().min(0).default(0),
  freeShippingMin: z.coerce.number().min(0).optional().nullable(),
  estimatedDays: z.coerce.number().int().min(1, "Minimo 1 dia"),
  isActive: z.boolean().default(true),
});
export type ShippingZoneInput = z.infer<typeof shippingZoneSchema>;
