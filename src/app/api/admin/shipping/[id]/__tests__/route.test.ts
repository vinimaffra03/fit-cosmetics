/**
 * @jest-environment node
 */

const mockRequireAdmin = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock("@/lib/admin", () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    shippingZone: {
      update: (...args: any[]) => mockUpdate(...args),
      delete: (...args: any[]) => mockDelete(...args),
    },
  },
}));

import { PUT, DELETE } from "../route";
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

const params = { params: { id: "zone-1" } };

describe("PUT /api/admin/shipping/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  const validBody = {
    name: "Sudeste Atualizado",
    zipCodeStart: "01000-000",
    zipCodeEnd: "39999-999",
    basePrice: 18.9,
    estimatedDays: 4,
  };

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authErr);
    const req = createRequest("http://localhost:3000/api/admin/shipping/zone-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(401);
  });

  it("should return 400 for invalid body", async () => {
    const req = createRequest("http://localhost:3000/api/admin/shipping/zone-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "S" }),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(400);
  });

  it("should update shipping zone successfully", async () => {
    mockUpdate.mockResolvedValue({ id: "zone-1", ...validBody });

    const req = createRequest("http://localhost:3000/api/admin/shipping/zone-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, params);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "zone-1" } })
    );
  });

  it("should return 500 on error", async () => {
    mockUpdate.mockRejectedValue(new Error("DB error"));

    const req = createRequest("http://localhost:3000/api/admin/shipping/zone-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/admin/shipping/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authErr);
    const req = createRequest("http://localhost:3000/api/admin/shipping/zone-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);
    expect(res.status).toBe(401);
  });

  it("should delete shipping zone successfully", async () => {
    mockDelete.mockResolvedValue({ id: "zone-1" });

    const req = createRequest("http://localhost:3000/api/admin/shipping/zone-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("should return 500 on error", async () => {
    mockDelete.mockRejectedValue(new Error("DB error"));

    const req = createRequest("http://localhost:3000/api/admin/shipping/zone-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);
    expect(res.status).toBe(500);
  });
});
