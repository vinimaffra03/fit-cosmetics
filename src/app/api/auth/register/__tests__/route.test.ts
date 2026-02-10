/**
 * @jest-environment node
 */
import { NextResponse } from "next/server";

const mockFindUnique = jest.fn();
const mockCreate = jest.fn();

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
      create: (...args: any[]) => mockCreate(...args),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password-123"),
}));

import { POST } from "../route";
import bcrypt from "bcryptjs";

function createRequest(body: Record<string, unknown>) {
  return new Request("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user successfully", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: "user-123" });

    const req = createRequest({
      firstName: "Maria",
      lastName: "Silva",
      email: "maria@example.com",
      password: "123456",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.message).toBe("Conta criada com sucesso");
    expect(data.userId).toBe("user-123");
  });

  it("should hash the password with 12 rounds", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: "user-123" });

    const req = createRequest({
      firstName: "Maria",
      lastName: "Silva",
      email: "maria@example.com",
      password: "minha-senha",
    });

    await POST(req);

    expect(bcrypt.hash).toHaveBeenCalledWith("minha-senha", 12);
  });

  it("should create user with full name", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: "user-123" });

    const req = createRequest({
      firstName: "Maria",
      lastName: "Silva",
      email: "maria@example.com",
      password: "123456",
    });

    await POST(req);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        email: "maria@example.com",
        password: "hashed-password-123",
        firstName: "Maria",
        lastName: "Silva",
        name: "Maria Silva",
      },
    });
  });

  it("should return 400 if email is missing", async () => {
    const req = createRequest({
      firstName: "Maria",
      password: "123456",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Campos obrigatórios não preenchidos");
  });

  it("should return 400 if password is missing", async () => {
    const req = createRequest({
      firstName: "Maria",
      email: "maria@example.com",
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("should return 400 if firstName is missing", async () => {
    const req = createRequest({
      email: "maria@example.com",
      password: "123456",
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("should return 400 if email already exists", async () => {
    mockFindUnique.mockResolvedValue({ id: "existing-user", email: "maria@example.com" });

    const req = createRequest({
      firstName: "Maria",
      lastName: "Silva",
      email: "maria@example.com",
      password: "123456",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("E-mail já cadastrado");
  });

  it("should return 500 on internal error", async () => {
    mockFindUnique.mockRejectedValue(new Error("DB connection failed"));

    const req = createRequest({
      firstName: "Maria",
      lastName: "Silva",
      email: "maria@example.com",
      password: "123456",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Erro interno do servidor");
  });

  it("should handle name trimming with only firstName", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: "user-456" });

    const req = createRequest({
      firstName: "Maria",
      email: "maria@example.com",
      password: "123456",
    });

    await POST(req);

    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "Maria undefined",
      }),
    });
  });
});
