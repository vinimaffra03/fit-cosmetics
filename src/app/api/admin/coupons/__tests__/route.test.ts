/**
 * @jest-environment node
 */

const mockRequireAdmin = jest.fn();
const mockFindMany = jest.fn();
const mockCreate = jest.fn();

jest.mock("@/lib/admin", () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    coupon: {
      findMany: (...args: any[]) => mockFindMany(...args),
      create: (...args: any[]) => mockCreate(...args),
    },
  },
}));

import { GET, POST } from "../route";
import { NextResponse } from "next/server";

function createRequest(url: string, options?: RequestInit) {
  return new Request(url, options) as any;
}

const adminSession = {
  error: null,
  session: { user: { id: "admin-1", role: "ADMIN" } },
};

describe("GET /api/admin/coupons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue({
      error: NextResponse.json({ error: "Denied" }, { status: 401 }),
      session: null,
    });
    const req = createRequest("http://localhost:3000/api/admin/coupons");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("should return all coupons with order count", async () => {
    const coupons = [
      { id: "c1", code: "PROMO10", _count: { orders: 5 } },
    ];
    mockFindMany.mockResolvedValue(coupons);

    const req = createRequest("http://localhost:3000/api/admin/coupons");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(coupons);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: { _count: { select: { orders: true } } },
      })
    );
  });
});

describe("POST /api/admin/coupons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  const validBody = {
    code: "summer20",
    discountType: "PERCENTAGE",
    discountValue: 20,
    startsAt: "2024-06-01",
  };

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue({
      error: NextResponse.json({ error: "Denied" }, { status: 401 }),
      session: null,
    });
    const req = createRequest("http://localhost:3000/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 400 for invalid body", async () => {
    const req = createRequest("http://localhost:3000/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "AB" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should create coupon with valid data and return 201", async () => {
    mockCreate.mockResolvedValue({ id: "coupon-1", code: "SUMMER20" });

    const req = createRequest("http://localhost:3000/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ code: "SUMMER20" }),
      })
    );
  });

  it("should return 409 on duplicate code (P2002)", async () => {
    const prismaError = new Error("Unique") as any;
    prismaError.code = "P2002";
    mockCreate.mockRejectedValue(prismaError);

    const req = createRequest("http://localhost:3000/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);

    expect(res.status).toBe(409);
  });

  it("should return 500 on unexpected error", async () => {
    mockCreate.mockRejectedValue(new Error("DB error"));

    const req = createRequest("http://localhost:3000/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});
