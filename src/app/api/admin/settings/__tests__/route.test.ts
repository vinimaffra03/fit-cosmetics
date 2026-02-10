/**
 * @jest-environment node
 */

const mockRequireAdmin = jest.fn();
const mockFindFirst = jest.fn();
const mockUpsert = jest.fn();

jest.mock("@/lib/admin", () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    storeSettings: {
      findFirst: (...args: any[]) => mockFindFirst(...args),
      upsert: (...args: any[]) => mockUpsert(...args),
    },
  },
}));

import { GET, PUT } from "../route";
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

describe("GET /api/admin/settings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authErr);
    const req = createRequest("http://localhost:3000/api/admin/settings");
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("should return current store settings", async () => {
    const settings = { id: "default", storeName: "FIT Cosmetics" };
    mockFindFirst.mockResolvedValue(settings);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.storeName).toBe("FIT Cosmetics");
  });
});

describe("PUT /api/admin/settings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  const validBody = {
    storeName: "FIT Cosmetics Updated",
    storeEmail: "novo@fitcosmetics.com.br",
    freeShippingMin: 250,
    maxInstallments: 10,
    minInstallmentValue: 15,
  };

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authErr);
    const req = createRequest("http://localhost:3000/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req);
    expect(res.status).toBe(401);
  });

  it("should return 400 for invalid body", async () => {
    const req = createRequest("http://localhost:3000/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeName: "F" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(400);
  });

  it("should upsert settings with id 'default'", async () => {
    mockUpsert.mockResolvedValue({ id: "default", ...validBody });

    const req = createRequest("http://localhost:3000/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req);

    expect(res.status).toBe(200);
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "default" },
      })
    );
  });

  it("should return 500 on error", async () => {
    mockUpsert.mockRejectedValue(new Error("DB error"));

    const req = createRequest("http://localhost:3000/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req);
    expect(res.status).toBe(500);
  });
});
