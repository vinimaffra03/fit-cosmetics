/**
 * @jest-environment node
 */

const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn();
const mockRemove = jest.fn();

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: (...args: any[]) => mockUpload(...args),
        getPublicUrl: (...args: any[]) => mockGetPublicUrl(...args),
        remove: (...args: any[]) => mockRemove(...args),
      }),
    },
  }),
}));

import { uploadImage, deleteImage } from "../supabase-storage";

describe("uploadImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  });

  it("should sanitize filename by replacing special chars with underscore", async () => {
    mockUpload.mockResolvedValue({
      data: { path: "products/123-my_file_jpg.jpg" },
      error: null,
    });
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: "https://cdn.example.com/products/123-my_file_jpg.jpg" },
    });

    await uploadImage(
      Buffer.from("data"),
      "my file (1).jpg",
      "image/jpeg"
    );

    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringContaining("my_file__1_.jpg"),
      expect.any(Buffer),
      { contentType: "image/jpeg", upsert: false }
    );
  });

  it("should return public URL on success", async () => {
    mockUpload.mockResolvedValue({
      data: { path: "products/123-test.jpg" },
      error: null,
    });
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: "https://cdn.example.com/products/123-test.jpg" },
    });

    const url = await uploadImage(Buffer.from("data"), "test.jpg", "image/jpeg");

    expect(url).toBe("https://cdn.example.com/products/123-test.jpg");
  });

  it("should throw on upload error", async () => {
    mockUpload.mockResolvedValue({
      data: null,
      error: new Error("Upload failed"),
    });

    await expect(
      uploadImage(Buffer.from("data"), "test.jpg", "image/jpeg")
    ).rejects.toThrow("Upload failed");
  });
});

describe("deleteImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  });

  it("should extract path from URL and call storage.remove", async () => {
    mockRemove.mockResolvedValue({ data: [], error: null });

    await deleteImage(
      "https://test.supabase.co/storage/v1/object/public/products/products/123-test.jpg"
    );

    expect(mockRemove).toHaveBeenCalledWith(["products/123-test.jpg"]);
  });

  it("should not call remove if path extraction fails", async () => {
    await deleteImage("https://other-domain.com/image.jpg");

    expect(mockRemove).not.toHaveBeenCalled();
  });
});
