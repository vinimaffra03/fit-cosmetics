/**
 * @jest-environment node
 */

const mockRequireAdmin = jest.fn();
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock("@/lib/admin", () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    coupon: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
      update: (...args: any[]) => mockUpdate(...args),
      delete: (...args: any[]) => mockDelete(...args),
    },
  },
}));

import { GET, PUT, DELETE } from "../route";
import { NextResponse } from "next/server";

function createRequest(url: string, options?: RequestInit) {
  return new Request(url, options) as any;
}

const adminSession = {
  error: null,
  session: { user: { id: "admin-1", role: "ADMIN" } },
};

const authErr = {
  error: NextResponse.json({ error: "Denied" }, { status: 401 }),
  session: null,
};

const params = { params: { id: "coupon-1" } };

describe("GET /api/admin/coupons/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authErr);
    const req = createRequest("http://localhost:3000/api/admin/coupons/coupon-1");
    const res = await GET(req, params);
    expect(res.status).toBe(401);
  });

  it("should return 404 when coupon not found", async () => {
    mockFindUnique.mockResolvedValue(null);
    const req = createRequest("http://localhost:3000/api/admin/coupons/coupon-1");
    const res = await GET(req, params);
    expect(res.status).toBe(404);
  });

  it("should return coupon data", async () => {
    const coupon = { id: "coupon-1", code: "SUMMER20", discountValue: 20 };
    mockFindUnique.mockResolvedValue(coupon);

    const req = createRequest("http://localhost:3000/api/admin/coupons/coupon-1");
    const res = await GET(req, params);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.code).toBe("SUMMER20");
  });
});

describe("PUT /api/admin/coupons/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  const validBody = {
    code: "updated20",
    discountType: "FIXED",
    discountValue: 25,
    startsAt: "2024-06-01",
  };

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authErr);
    const req = createRequest("http://localhost:3000/api/admin/coupons/coupon-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(401);
  });

  it("should return 400 for invalid body", async () => {
    const req = createRequest("http://localhost:3000/api/admin/coupons/coupon-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "AB" }),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(400);
  });

  it("should update coupon successfully", async () => {
    mockUpdate.mockResolvedValue({ id: "coupon-1", code: "UPDATED20" });

    const req = createRequest("http://localhost:3000/api/admin/coupons/coupon-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, params);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "coupon-1" } })
    );
  });

  it("should return 409 on duplicate code", async () => {
    const prismaError = new Error("Unique") as any;
    prismaError.code = "P2002";
    mockUpdate.mockRejectedValue(prismaError);

    const req = createRequest("http://localhost:3000/api/admin/coupons/coupon-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(409);
  });

  it("should return 500 on unexpected error", async () => {
    mockUpdate.mockRejectedValue(new Error("DB error"));

    const req = createRequest("http://localhost:3000/api/admin/coupons/coupon-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/admin/coupons/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authErr);
    const req = createRequest("http://localhost:3000/api/admin/coupons/coupon-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);
    expect(res.status).toBe(401);
  });

  it("should delete coupon successfully", async () => {
    mockDelete.mockResolvedValue({ id: "coupon-1" });

    const req = createRequest("http://localhost:3000/api/admin/coupons/coupon-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("should return 500 on error", async () => {
    mockDelete.mockRejectedValue(new Error("DB error"));

    const req = createRequest("http://localhost:3000/api/admin/coupons/coupon-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);
    expect(res.status).toBe(500);
  });
});
