/**
 * @jest-environment node
 */

const mockRequireAdmin = jest.fn();
const mockFindMany = jest.fn();
const mockCount = jest.fn();

jest.mock("@/lib/admin", () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findMany: (...args: any[]) => mockFindMany(...args),
      count: (...args: any[]) => mockCount(...args),
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

describe("GET /api/admin/customers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue({
      error: NextResponse.json({ error: "Denied" }, { status: 401 }),
      session: null,
    });
    const req = createRequest("http://localhost:3000/api/admin/customers");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("should return paginated customer list with role CUSTOMER", async () => {
    const customers = [{ id: "u1", name: "Maria", role: "CUSTOMER" }];
    mockFindMany.mockResolvedValue(customers);
    mockCount.mockResolvedValue(1);

    const req = createRequest("http://localhost:3000/api/admin/customers");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.customers).toEqual(customers);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ role: "CUSTOMER" }),
      })
    );
  });

  it("should filter by search param", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const req = createRequest("http://localhost:3000/api/admin/customers?search=maria");
    await GET(req);

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          role: "CUSTOMER",
          OR: expect.arrayContaining([
            expect.objectContaining({ name: { contains: "maria", mode: "insensitive" } }),
          ]),
        }),
      })
    );
  });
});
