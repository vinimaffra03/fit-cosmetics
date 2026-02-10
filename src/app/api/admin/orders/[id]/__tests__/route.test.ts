/**
 * @jest-environment node
 */

const mockRequireAdmin = jest.fn();
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();

jest.mock("@/lib/admin", () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    order: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
      update: (...args: any[]) => mockUpdate(...args),
    },
  },
}));

import { GET, PATCH } from "../route";
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

const params = { params: { id: "order-1" } };

describe("GET /api/admin/orders/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authErr);
    const req = createRequest("http://localhost:3000/api/admin/orders/order-1");
    const res = await GET(req, params);
    expect(res.status).toBe(401);
  });

  it("should return 404 when order not found", async () => {
    mockFindUnique.mockResolvedValue(null);
    const req = createRequest("http://localhost:3000/api/admin/orders/order-1");
    const res = await GET(req, params);
    expect(res.status).toBe(404);
  });

  it("should return order with all relations", async () => {
    const order = {
      id: "order-1",
      orderNumber: "ORD-001",
      user: { name: "Maria" },
      address: { city: "SP" },
      items: [{ id: "item-1" }],
      payment: { status: "PAID" },
      coupon: null,
    };
    mockFindUnique.mockResolvedValue(order);

    const req = createRequest("http://localhost:3000/api/admin/orders/order-1");
    const res = await GET(req, params);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.orderNumber).toBe("ORD-001");
    expect(data.user.name).toBe("Maria");
  });
});

describe("PATCH /api/admin/orders/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authErr);
    const req = createRequest("http://localhost:3000/api/admin/orders/order-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SHIPPED" }),
    });
    const res = await PATCH(req, params);
    expect(res.status).toBe(401);
  });

  it("should return 400 for invalid status value", async () => {
    const req = createRequest("http://localhost:3000/api/admin/orders/order-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "INVALID" }),
    });
    const res = await PATCH(req, params);
    expect(res.status).toBe(400);
  });

  it("should update order status successfully", async () => {
    mockUpdate.mockResolvedValue({ id: "order-1", status: "SHIPPED" });

    const req = createRequest("http://localhost:3000/api/admin/orders/order-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SHIPPED" }),
    });
    const res = await PATCH(req, params);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "order-1" },
        data: expect.objectContaining({ status: "SHIPPED" }),
      })
    );
  });

  it("should update with trackingNumber and trackingUrl", async () => {
    mockUpdate.mockResolvedValue({ id: "order-1", status: "SHIPPED" });

    const req = createRequest("http://localhost:3000/api/admin/orders/order-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "SHIPPED",
        trackingNumber: "BR123456789",
        trackingUrl: "https://rastreamento.correios.com.br/BR123456789",
      }),
    });
    const res = await PATCH(req, params);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          trackingNumber: "BR123456789",
          trackingUrl: "https://rastreamento.correios.com.br/BR123456789",
        }),
      })
    );
  });

  it("should set null for empty optional fields", async () => {
    mockUpdate.mockResolvedValue({ id: "order-1", status: "CONFIRMED" });

    const req = createRequest("http://localhost:3000/api/admin/orders/order-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CONFIRMED" }),
    });
    await PATCH(req, params);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          trackingNumber: null,
          trackingUrl: null,
          notes: null,
        }),
      })
    );
  });

  it("should return 500 on database error", async () => {
    mockUpdate.mockRejectedValue(new Error("DB error"));

    const req = createRequest("http://localhost:3000/api/admin/orders/order-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DELIVERED" }),
    });
    const res = await PATCH(req, params);
    expect(res.status).toBe(500);
  });
});
