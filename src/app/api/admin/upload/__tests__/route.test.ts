/**
 * @jest-environment node
 */

const mockRequireAdmin = jest.fn();
const mockUploadImage = jest.fn();

jest.mock("@/lib/admin", () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

jest.mock("@/lib/supabase-storage", () => ({
  uploadImage: (...args: any[]) => mockUploadImage(...args),
}));

import { POST } from "../route";
import { NextResponse } from "next/server";

const adminSession = {
  error: null,
  session: { user: { id: "admin-1", role: "ADMIN" } },
};

const authErr = {
  error: NextResponse.json({ error: "Denied" }, { status: 401 }),
  session: null,
};

function createFileRequest(file: File | null) {
  const formData = new FormData();
  if (file) formData.append("file", file);

  return new Request("http://localhost:3000/api/admin/upload", {
    method: "POST",
    body: formData,
  }) as any;
}

function createMockFile(
  name: string,
  type: string,
  sizeInBytes: number
): File {
  const content = new Uint8Array(sizeInBytes);
  return new File([content], name, { type });
}

describe("POST /api/admin/upload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdmin.mockResolvedValue(adminSession);
  });

  it("should return 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue(authErr);
    const req = createFileRequest(createMockFile("img.jpg", "image/jpeg", 100));
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 400 when no file is provided", async () => {
    const req = createFileRequest(null);
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Nenhum arquivo");
  });

  it("should return 400 for disallowed file type", async () => {
    const file = createMockFile("doc.pdf", "application/pdf", 100);
    const req = createFileRequest(file);
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Tipo de arquivo");
  });

  it("should return 400 for file exceeding 5MB", async () => {
    const file = createMockFile("big.jpg", "image/jpeg", 6 * 1024 * 1024);
    const req = createFileRequest(file);
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("5MB");
  });

  it("should accept image/jpeg", async () => {
    mockUploadImage.mockResolvedValue("https://cdn.example.com/img.jpg");
    const file = createMockFile("photo.jpg", "image/jpeg", 1024);
    const req = createFileRequest(file);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toBe("https://cdn.example.com/img.jpg");
  });

  it("should accept image/png", async () => {
    mockUploadImage.mockResolvedValue("https://cdn.example.com/img.png");
    const file = createMockFile("photo.png", "image/png", 1024);
    const req = createFileRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("should accept image/webp", async () => {
    mockUploadImage.mockResolvedValue("https://cdn.example.com/img.webp");
    const file = createMockFile("photo.webp", "image/webp", 1024);
    const req = createFileRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("should accept image/avif", async () => {
    mockUploadImage.mockResolvedValue("https://cdn.example.com/img.avif");
    const file = createMockFile("photo.avif", "image/avif", 1024);
    const req = createFileRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("should return 500 when uploadImage throws", async () => {
    mockUploadImage.mockRejectedValue(new Error("Storage error"));
    const file = createMockFile("photo.jpg", "image/jpeg", 1024);
    const req = createFileRequest(file);
    const res = await POST(req);

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Storage error");
  });
});
