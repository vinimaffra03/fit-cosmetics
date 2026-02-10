/**
 * @jest-environment node
 */

const mockRequireAdmin = jest.fn();
const mockFindMany = jest.fn();
const mockCount = jest.fn();
const mockCreate = jest.fn();

jest.mock("@/lib/admin", () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    product: {
      findMany: (...args: any[]) => mockFindMany(...args),
      count: (...args: any[]) => mockCount(...args),
      create: (...args: any[]) => mockCreate(...args),
    },
  },
}));

import { GET, POST } from "../route";
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

describe("GET /api/admin/products", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authError(401));

    const req = createRequest("http://localhost:3000/api/admin/products");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("should return paginated product list with defaults", async () => {
    const products = [{ id: "1", name: "Product A" }];
    mockFindMany.mockResolvedValue(products);
    mockCount.mockResolvedValue(1);

    const req = createRequest("http://localhost:3000/api/admin/products");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.products).toEqual(products);
    expect(data.total).toBe(1);
    expect(data.page).toBe(1);
    expect(data.limit).toBe(20);
  });

  it("should filter by search param on name", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const req = createRequest("http://localhost:3000/api/admin/products?search=shampoo");
    await GET(req);

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          name: { contains: "shampoo", mode: "insensitive" },
        }),
      })
    );
  });

  it("should filter by categoryId param", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const req = createRequest("http://localhost:3000/api/admin/products?categoryId=cat-1");
    await GET(req);

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ categoryId: "cat-1" }),
      })
    );
  });

  it("should filter by isActive=true", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const req = createRequest("http://localhost:3000/api/admin/products?isActive=true");
    await GET(req);

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true }),
      })
    );
  });

  it("should handle custom page and limit params", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(50);

    const req = createRequest("http://localhost:3000/api/admin/products?page=3&limit=10");
    const res = await GET(req);
    const data = await res.json();

    expect(data.page).toBe(3);
    expect(data.limit).toBe(10);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 20, take: 10 })
    );
  });
});

describe("POST /api/admin/products", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  const validBody = {
    name: "Shampoo Test",
    slug: "shampoo-test",
    description: "Um shampoo de teste excelente para cabelos",
    price: 29.9,
    stock: 50,
  };

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authError(401));

    const req = createRequest("http://localhost:3000/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 400 with validation errors for invalid body", async () => {
    const req = createRequest("http://localhost:3000/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "A" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.errors).toBeDefined();
  });

  it("should create product with valid data and return 201", async () => {
    const createdProduct = { id: "prod-1", ...validBody };
    mockCreate.mockResolvedValue(createdProduct);

    const req = createRequest("http://localhost:3000/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalled();
  });

  it("should create product with images when provided", async () => {
    mockCreate.mockResolvedValue({ id: "prod-1" });

    const req = createRequest("http://localhost:3000/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validBody,
        images: [
          { url: "https://example.com/img1.jpg", alt: "Image 1" },
          { url: "https://example.com/img2.jpg" },
        ],
      }),
    });
    await POST(req);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          images: {
            create: expect.arrayContaining([
              expect.objectContaining({ url: "https://example.com/img1.jpg", position: 0 }),
            ]),
          },
        }),
      })
    );
  });

  it("should return 409 on duplicate slug/SKU (P2002)", async () => {
    const prismaError = new Error("Unique constraint") as any;
    prismaError.code = "P2002";
    mockCreate.mockRejectedValue(prismaError);

    const req = createRequest("http://localhost:3000/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);

    expect(res.status).toBe(409);
  });

  it("should return 500 on unexpected database error", async () => {
    mockCreate.mockRejectedValue(new Error("DB crashed"));

    const req = createRequest("http://localhost:3000/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});
