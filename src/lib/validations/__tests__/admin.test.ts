import {
  productSchema,
  couponSchema,
  orderStatusSchema,
  storeSettingsSchema,
  shippingZoneSchema,
} from "../admin";

// ==========================================
// productSchema
// ==========================================
describe("productSchema", () => {
  const validProduct = {
    name: "Shampoo Hidratante",
    slug: "shampoo-hidratante",
    description: "Um excelente shampoo para cabelos secos e danificados",
    price: 49.9,
    stock: 100,
  };

  it("should validate a complete valid product", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("should default isActive to true, isFeatured and isNew to false", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(true);
      expect(result.data.isFeatured).toBe(false);
      expect(result.data.isNew).toBe(false);
    }
  });

  it("should default benefits to empty array", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.benefits).toEqual([]);
    }
  });

  it("should accept optional nullable fields as null", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      compareAtPrice: null,
      sku: null,
      categoryId: null,
      brandId: null,
    });
    expect(result.success).toBe(true);
  });

  it("should coerce string numbers to numbers for price and stock", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      price: "49.90",
      stock: "100",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(49.9);
      expect(result.data.stock).toBe(100);
    }
  });

  it("should reject name shorter than 3 chars", () => {
    const result = productSchema.safeParse({ ...validProduct, name: "AB" });
    expect(result.success).toBe(false);
  });

  it("should reject invalid slug format with uppercase", () => {
    const result = productSchema.safeParse({ ...validProduct, slug: "Shampoo" });
    expect(result.success).toBe(false);
  });

  it("should reject invalid slug format with spaces", () => {
    const result = productSchema.safeParse({ ...validProduct, slug: "shampoo hidratante" });
    expect(result.success).toBe(false);
  });

  it("should reject slug shorter than 3 chars", () => {
    const result = productSchema.safeParse({ ...validProduct, slug: "ab" });
    expect(result.success).toBe(false);
  });

  it("should reject description shorter than 10 chars", () => {
    const result = productSchema.safeParse({ ...validProduct, description: "Curta" });
    expect(result.success).toBe(false);
  });

  it("should reject zero or negative price", () => {
    const result = productSchema.safeParse({ ...validProduct, price: 0 });
    expect(result.success).toBe(false);

    const result2 = productSchema.safeParse({ ...validProduct, price: -10 });
    expect(result2.success).toBe(false);
  });

  it("should reject negative stock", () => {
    const result = productSchema.safeParse({ ...validProduct, stock: -1 });
    expect(result.success).toBe(false);
  });

  it("should accept valid benefits array", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      benefits: ["Hidratacao profunda", "Brilho intenso"],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.benefits).toEqual(["Hidratacao profunda", "Brilho intenso"]);
    }
  });
});

// ==========================================
// couponSchema
// ==========================================
describe("couponSchema", () => {
  const validCoupon = {
    code: "promo10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    startsAt: "2024-01-01",
  };

  it("should validate correct coupon data", () => {
    const result = couponSchema.safeParse(validCoupon);
    expect(result.success).toBe(true);
  });

  it("should transform code to uppercase", () => {
    const result = couponSchema.safeParse(validCoupon);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe("PROMO10");
    }
  });

  it("should accept all three discount types", () => {
    for (const type of ["PERCENTAGE", "FIXED", "FREE_SHIPPING"]) {
      const result = couponSchema.safeParse({ ...validCoupon, discountType: type });
      expect(result.success).toBe(true);
    }
  });

  it("should reject invalid discount type", () => {
    const result = couponSchema.safeParse({ ...validCoupon, discountType: "BOGO" });
    expect(result.success).toBe(false);
  });

  it("should reject code shorter than 3 chars", () => {
    const result = couponSchema.safeParse({ ...validCoupon, code: "AB" });
    expect(result.success).toBe(false);
  });

  it("should reject negative discountValue", () => {
    const result = couponSchema.safeParse({ ...validCoupon, discountValue: -5 });
    expect(result.success).toBe(false);
  });

  it("should coerce date strings to Date for startsAt", () => {
    const result = couponSchema.safeParse(validCoupon);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.startsAt).toBeInstanceOf(Date);
    }
  });

  it("should accept null expiresAt", () => {
    const result = couponSchema.safeParse({ ...validCoupon, expiresAt: null });
    expect(result.success).toBe(true);
  });

  it("should default isActive to true", () => {
    const result = couponSchema.safeParse(validCoupon);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(true);
    }
  });
});

// ==========================================
// orderStatusSchema
// ==========================================
describe("orderStatusSchema", () => {
  it("should validate a valid status update", () => {
    const result = orderStatusSchema.safeParse({ status: "SHIPPED" });
    expect(result.success).toBe(true);
  });

  it("should accept all 7 status enum values", () => {
    const statuses = [
      "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED",
      "DELIVERED", "CANCELLED", "REFUNDED",
    ];
    for (const status of statuses) {
      const result = orderStatusSchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it("should reject invalid status value", () => {
    const result = orderStatusSchema.safeParse({ status: "UNKNOWN" });
    expect(result.success).toBe(false);
  });

  it("should accept empty string for trackingUrl", () => {
    const result = orderStatusSchema.safeParse({
      status: "SHIPPED",
      trackingUrl: "",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid trackingUrl", () => {
    const result = orderStatusSchema.safeParse({
      status: "SHIPPED",
      trackingUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should accept optional trackingNumber and notes as null", () => {
    const result = orderStatusSchema.safeParse({
      status: "SHIPPED",
      trackingNumber: null,
      notes: null,
    });
    expect(result.success).toBe(true);
  });
});

// ==========================================
// storeSettingsSchema
// ==========================================
describe("storeSettingsSchema", () => {
  const validSettings = {
    storeName: "FIT Cosmetics",
    storeEmail: "contato@fitcosmetics.com.br",
    freeShippingMin: 199,
    maxInstallments: 12,
    minInstallmentValue: 10,
  };

  it("should validate complete valid settings", () => {
    const result = storeSettingsSchema.safeParse(validSettings);
    expect(result.success).toBe(true);
  });

  it("should reject short storeName", () => {
    const result = storeSettingsSchema.safeParse({ ...validSettings, storeName: "F" });
    expect(result.success).toBe(false);
  });

  it("should reject invalid storeEmail", () => {
    const result = storeSettingsSchema.safeParse({ ...validSettings, storeEmail: "invalid" });
    expect(result.success).toBe(false);
  });

  it("should enforce maxInstallments between 1 and 12", () => {
    const r1 = storeSettingsSchema.safeParse({ ...validSettings, maxInstallments: 0 });
    expect(r1.success).toBe(false);

    const r2 = storeSettingsSchema.safeParse({ ...validSettings, maxInstallments: 13 });
    expect(r2.success).toBe(false);

    const r3 = storeSettingsSchema.safeParse({ ...validSettings, maxInstallments: 6 });
    expect(r3.success).toBe(true);
  });

  it("should enforce minInstallmentValue >= 1", () => {
    const result = storeSettingsSchema.safeParse({ ...validSettings, minInstallmentValue: 0 });
    expect(result.success).toBe(false);
  });

  it("should coerce string numbers for freeShippingMin", () => {
    const result = storeSettingsSchema.safeParse({ ...validSettings, freeShippingMin: "199" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.freeShippingMin).toBe(199);
    }
  });
});

// ==========================================
// shippingZoneSchema
// ==========================================
describe("shippingZoneSchema", () => {
  const validZone = {
    name: "Sudeste",
    zipCodeStart: "01000-000",
    zipCodeEnd: "39999-999",
    basePrice: 15.9,
    estimatedDays: 5,
  };

  it("should validate a valid shipping zone", () => {
    const result = shippingZoneSchema.safeParse(validZone);
    expect(result.success).toBe(true);
  });

  it("should reject name shorter than 2 chars", () => {
    const result = shippingZoneSchema.safeParse({ ...validZone, name: "S" });
    expect(result.success).toBe(false);
  });

  it("should reject short zipCodeStart", () => {
    const result = shippingZoneSchema.safeParse({ ...validZone, zipCodeStart: "0100" });
    expect(result.success).toBe(false);
  });

  it("should reject short zipCodeEnd", () => {
    const result = shippingZoneSchema.safeParse({ ...validZone, zipCodeEnd: "3999" });
    expect(result.success).toBe(false);
  });

  it("should reject negative basePrice", () => {
    const result = shippingZoneSchema.safeParse({ ...validZone, basePrice: -1 });
    expect(result.success).toBe(false);
  });

  it("should default pricePerKg to 0", () => {
    const result = shippingZoneSchema.safeParse(validZone);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.pricePerKg).toBe(0);
    }
  });

  it("should reject estimatedDays less than 1", () => {
    const result = shippingZoneSchema.safeParse({ ...validZone, estimatedDays: 0 });
    expect(result.success).toBe(false);
  });

  it("should default isActive to true", () => {
    const result = shippingZoneSchema.safeParse(validZone);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(true);
    }
  });

  it("should accept nullable freeShippingMin", () => {
    const result = shippingZoneSchema.safeParse({ ...validZone, freeShippingMin: null });
    expect(result.success).toBe(true);
  });
});
