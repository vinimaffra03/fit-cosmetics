/**
 * @jest-environment node
 */

const mockRequireAdmin = jest.fn();
const mockFindUnique = jest.fn();
const mockAggregate = jest.fn();

jest.mock("@/lib/admin", () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
    },
    order: {
      aggregate: (...args: any[]) => mockAggregate(...args),
    },
  },
}));

import { GET } from "../route";
import { NextResponse } from "next/server";

function createRequest(url: string) {
  return new Request(url) as any;
}

const adminSession = {
  error: null,
  session: { user: { id: "admin-1", role: "ADMIN" } },
};

const params = { params: { id: "user-1" } };

describe("GET /api/admin/customers/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue({
      error: NextResponse.json({ error: "Denied" }, { status: 401 }),
      session: null,
    });
    const req = createRequest("http://localhost:3000/api/admin/customers/user-1");
    const res = await GET(req, params);
    expect(res.status).toBe(401);
  });

  it("should return 404 when customer not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const req = createRequest("http://localhost:3000/api/admin/customers/user-1");
    const res = await GET(req, params);
    expect(res.status).toBe(404);
  });

  it("should return customer with orders, addresses, reviews, totalSpent", async () => {
    mockFindUnique.mockResolvedValue({
      id: "user-1",
      name: "Maria Silva",
      orders: [{ id: "o1" }],
      addresses: [{ id: "addr-1" }],
      reviews: [],
    });
    mockAggregate.mockResolvedValue({ _sum: { total: 500.0 } });

    const req = createRequest("http://localhost:3000/api/admin/customers/user-1");
    const res = await GET(req, params);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.name).toBe("Maria Silva");
    expect(data.totalSpent).toBe(500.0);
  });

  it("should return totalSpent as 0 when no orders", async () => {
    mockFindUnique.mockResolvedValue({
      id: "user-1",
      name: "Nova Cliente",
      orders: [],
      addresses: [],
      reviews: [],
    });
    mockAggregate.mockResolvedValue({ _sum: { total: null } });

    const req = createRequest("http://localhost:3000/api/admin/customers/user-1");
    const res = await GET(req, params);
    const data = await res.json();

    expect(data.totalSpent).toBe(0);
  });
});
