/**
 * @jest-environment node
 */

const mockAuth = jest.fn();

jest.mock("@/lib/auth", () => ({
  auth: (...args: any[]) => mockAuth(...args),
}));

import { requireAdmin } from "../admin";

describe("requireAdmin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when session is null", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await requireAdmin();

    expect(result.session).toBeNull();
    const body = await result.error!.json();
    expect(result.error!.status).toBe(401);
    expect(body.error).toBe("Nao autenticado");
  });

  it("should return 401 when session has no user", async () => {
    mockAuth.mockResolvedValue({ user: null });

    const result = await requireAdmin();

    expect(result.session).toBeNull();
    expect(result.error!.status).toBe(401);
  });

  it("should return 403 when user role is CUSTOMER", async () => {
    mockAuth.mockResolvedValue({ user: { id: "1", role: "CUSTOMER" } });

    const result = await requireAdmin();

    expect(result.session).toBeNull();
    const body = await result.error!.json();
    expect(result.error!.status).toBe(403);
    expect(body.error).toBe("Acesso negado");
  });

  it("should return 403 when user role is undefined", async () => {
    mockAuth.mockResolvedValue({ user: { id: "1" } });

    const result = await requireAdmin();

    expect(result.session).toBeNull();
    expect(result.error!.status).toBe(403);
  });

  it("should return null error and session for ADMIN role", async () => {
    const session = { user: { id: "1", role: "ADMIN" } };
    mockAuth.mockResolvedValue(session);

    const result = await requireAdmin();

    expect(result.error).toBeNull();
    expect(result.session).toEqual(session);
  });

  it("should return null error and session for SUPER_ADMIN role", async () => {
    const session = { user: { id: "1", role: "SUPER_ADMIN" } };
    mockAuth.mockResolvedValue(session);

    const result = await requireAdmin();

    expect(result.error).toBeNull();
    expect(result.session).toEqual(session);
  });
});
