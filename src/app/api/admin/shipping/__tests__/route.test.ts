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
    shippingZone: {
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

const authErr = {
  error: NextResponse.json({ error: "Denied" }, { status: 401 }),
  session: null,
};

describe("GET /api/admin/shipping", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authErr);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("should return all shipping zones ordered by zipCodeStart", async () => {
    const zones = [
      { id: "z1", name: "Sudeste", zipCodeStart: "01000-000" },
    ];
    mockFindMany.mockResolvedValue(zones);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(zones);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { zipCodeStart: "asc" },
      })
    );
  });
});

describe("POST /api/admin/shipping", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  const validBody = {
    name: "Sudeste",
    zipCodeStart: "01000-000",
    zipCodeEnd: "39999-999",
    basePrice: 15.9,
    estimatedDays: 5,
  };

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authErr);
    const req = createRequest("http://localhost:3000/api/admin/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 400 for invalid body", async () => {
    const req = createRequest("http://localhost:3000/api/admin/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "S" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should create shipping zone with valid data and return 201", async () => {
    mockCreate.mockResolvedValue({ id: "z1", ...validBody });

    const req = createRequest("http://localhost:3000/api/admin/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalled();
  });

  it("should return 500 on error", async () => {
    mockCreate.mockRejectedValue(new Error("DB error"));

    const req = createRequest("http://localhost:3000/api/admin/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
