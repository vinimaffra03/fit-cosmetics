/**
 * @jest-environment node
 */

const mockRequireAdmin = jest.fn();
const mockFindUnique = jest.fn();
const mockDelete = jest.fn();
const mockImageFindMany = jest.fn();
const mockDeleteImage = jest.fn();
const mockTransaction = jest.fn();

jest.mock("@/lib/admin", () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    product: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
      delete: (...args: any[]) => mockDelete(...args),
    },
    productImage: {
      findMany: (...args: any[]) => mockImageFindMany(...args),
    },
    $transaction: (...args: any[]) => mockTransaction(...args),
  },
}));

jest.mock("@/lib/supabase-storage", () => ({
  deleteImage: (...args: any[]) => mockDeleteImage(...args),
}));

import { GET, PUT, DELETE } from "../route";
import { NextResponse } from "next/server";

function createRequest(url: string, options?: RequestInit) {
  return new Request(url, options) as any;
}

function authError(status: number) {
  return {
    error: NextResponse.json({ error: "Denied" }, { status }),
    session: null,
  };
}

const adminSession = {
  error: null,
  session: { user: { id: "admin-1", role: "ADMIN" } },
};

const params = { params: { id: "prod-1" } };

describe("GET /api/admin/products/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authError(401));
    const req = createRequest("http://localhost:3000/api/admin/products/prod-1");
    const res = await GET(req, params);
    expect(res.status).toBe(401);
  });

  it("should return 404 when product not found", async () => {
    mockFindUnique.mockResolvedValue(null);
    const req = createRequest("http://localhost:3000/api/admin/products/prod-1");
    const res = await GET(req, params);
    expect(res.status).toBe(404);
  });

  it("should return product with images, category, brand", async () => {
    const product = {
      id: "prod-1",
      name: "Shampoo",
      images: [{ url: "https://example.com/img.jpg" }],
      category: { id: "cat-1", name: "Hair" },
      brand: { id: "brand-1", name: "FIT" },
    };
    mockFindUnique.mockResolvedValue(product);

    const req = createRequest("http://localhost:3000/api/admin/products/prod-1");
    const res = await GET(req, params);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.name).toBe("Shampoo");
    expect(data.images).toHaveLength(1);
  });
});

describe("PUT /api/admin/products/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  const validBody = {
    name: "Shampoo Updated",
    slug: "shampoo-updated",
    description: "Descricao atualizada do shampoo de teste",
    price: 39.9,
    stock: 80,
  };

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authError(401));
    const req = createRequest("http://localhost:3000/api/admin/products/prod-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(401);
  });

  it("should return 400 for invalid body", async () => {
    const req = createRequest("http://localhost:3000/api/admin/products/prod-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "A" }),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(400);
  });

  it("should update product data successfully", async () => {
    const updatedProduct = { id: "prod-1", ...validBody };
    mockTransaction.mockImplementation(async (fn: any) => fn({
      productImage: {
        findMany: jest.fn().mockResolvedValue([]),
        delete: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
      },
      product: {
        update: jest.fn().mockResolvedValue(updatedProduct),
      },
    }));

    const req = createRequest("http://localhost:3000/api/admin/products/prod-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, params);

    expect(res.status).toBe(200);
  });

  it("should return 409 on duplicate slug/SKU (P2002)", async () => {
    const prismaError = new Error("Unique") as any;
    prismaError.code = "P2002";
    mockTransaction.mockRejectedValue(prismaError);

    const req = createRequest("http://localhost:3000/api/admin/products/prod-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, params);

    expect(res.status).toBe(409);
  });

  it("should return 500 on unexpected error", async () => {
    mockTransaction.mockRejectedValue(new Error("DB crashed"));

    const req = createRequest("http://localhost:3000/api/admin/products/prod-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, params);

    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/admin/products/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authError(401));
    const req = createRequest("http://localhost:3000/api/admin/products/prod-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);
    expect(res.status).toBe(401);
  });

  it("should delete all product images from storage then delete product", async () => {
    mockImageFindMany.mockResolvedValue([
      { id: "img-1", url: "https://example.com/img1.jpg" },
      { id: "img-2", url: "https://example.com/img2.jpg" },
    ]);
    mockDeleteImage.mockResolvedValue(undefined);
    mockDelete.mockResolvedValue({ id: "prod-1" });

    const req = createRequest("http://localhost:3000/api/admin/products/prod-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);

    expect(res.status).toBe(200);
    expect(mockDeleteImage).toHaveBeenCalledTimes(2);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "prod-1" } });
  });

  it("should continue deletion even if image storage delete fails", async () => {
    mockImageFindMany.mockResolvedValue([
      { id: "img-1", url: "https://example.com/img1.jpg" },
    ]);
    mockDeleteImage.mockRejectedValue(new Error("Storage error"));
    mockDelete.mockResolvedValue({ id: "prod-1" });

    const req = createRequest("http://localhost:3000/api/admin/products/prod-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);

    expect(res.status).toBe(200);
    expect(mockDelete).toHaveBeenCalled();
  });

  it("should return 500 on database error", async () => {
    mockImageFindMany.mockResolvedValue([]);
    mockDelete.mockRejectedValue(new Error("DB error"));

    const req = createRequest("http://localhost:3000/api/admin/products/prod-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);

    expect(res.status).toBe(500);
  });
});
