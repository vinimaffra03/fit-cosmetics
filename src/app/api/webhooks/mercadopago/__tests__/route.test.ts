/**
 * @jest-environment node
 */
const mockGetPaymentStatus = jest.fn();
const mockPaymentFindFirst = jest.fn();
const mockPaymentUpdate = jest.fn();
const mockOrderUpdate = jest.fn();
const mockTransaction = jest.fn();

jest.mock("@/lib/payments/mercadopago", () => ({
  getPaymentStatus: (...args: any[]) => mockGetPaymentStatus(...args),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    payment: {
      findFirst: (...args: any[]) => mockPaymentFindFirst(...args),
      update: (...args: any[]) => mockPaymentUpdate(...args),
    },
    order: {
      update: (...args: any[]) => mockOrderUpdate(...args),
    },
    $transaction: (...args: any[]) => mockTransaction(...args),
  },
}));

import { POST } from "../route";

function createWebhookRequest(body: Record<string, unknown>) {
  return new Request("http://localhost:3000/api/webhooks/mercadopago", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const mockDbPayment = {
  id: "pay-123",
  externalId: "mp-12345",
  orderId: "order-123",
  order: { id: "order-123", status: "PENDING" },
};

describe("POST /api/webhooks/mercadopago", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTransaction.mockResolvedValue([]);
  });

  it("should process approved payment", async () => {
    mockGetPaymentStatus.mockResolvedValue({ status: "approved" });
    mockPaymentFindFirst.mockResolvedValue(mockDbPayment);

    const req = createWebhookRequest({
      type: "payment",
      data: { id: "mp-12345" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.received).toBe(true);
    expect(mockTransaction).toHaveBeenCalled();
  });

  it("should map approved status to PAID/CONFIRMED", async () => {
    mockGetPaymentStatus.mockResolvedValue({ status: "approved" });
    mockPaymentFindFirst.mockResolvedValue(mockDbPayment);

    const req = createWebhookRequest({
      type: "payment",
      data: { id: "mp-12345" },
    });

    await POST(req);

    expect(mockTransaction).toHaveBeenCalledTimes(1);
    expect(mockPaymentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "pay-123" },
        data: expect.objectContaining({ status: "PAID" }),
      })
    );
    expect(mockOrderUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "order-123" },
        data: { status: "CONFIRMED" },
      })
    );
  });

  it("should map pending status to PROCESSING/PENDING", async () => {
    mockGetPaymentStatus.mockResolvedValue({ status: "pending" });
    mockPaymentFindFirst.mockResolvedValue(mockDbPayment);

    const req = createWebhookRequest({
      type: "payment",
      data: { id: "mp-12345" },
    });

    await POST(req);

    expect(mockTransaction).toHaveBeenCalled();
  });

  it("should map in_process status to PROCESSING/PENDING", async () => {
    mockGetPaymentStatus.mockResolvedValue({ status: "in_process" });
    mockPaymentFindFirst.mockResolvedValue(mockDbPayment);

    const req = createWebhookRequest({
      type: "payment",
      data: { id: "mp-12345" },
    });

    await POST(req);

    expect(mockTransaction).toHaveBeenCalled();
  });

  it("should map rejected status to FAILED/CANCELLED", async () => {
    mockGetPaymentStatus.mockResolvedValue({ status: "rejected" });
    mockPaymentFindFirst.mockResolvedValue(mockDbPayment);

    const req = createWebhookRequest({
      type: "payment",
      data: { id: "mp-12345" },
    });

    await POST(req);

    expect(mockTransaction).toHaveBeenCalled();
  });

  it("should map refunded status to REFUNDED/REFUNDED", async () => {
    mockGetPaymentStatus.mockResolvedValue({ status: "refunded" });
    mockPaymentFindFirst.mockResolvedValue(mockDbPayment);

    const req = createWebhookRequest({
      type: "payment",
      data: { id: "mp-12345" },
    });

    await POST(req);

    expect(mockTransaction).toHaveBeenCalled();
  });

  it("should map cancelled status to CANCELLED/CANCELLED", async () => {
    mockGetPaymentStatus.mockResolvedValue({ status: "cancelled" });
    mockPaymentFindFirst.mockResolvedValue(mockDbPayment);

    const req = createWebhookRequest({
      type: "payment",
      data: { id: "mp-12345" },
    });

    await POST(req);

    expect(mockTransaction).toHaveBeenCalled();
  });

  it("should return 404 if payment not found in DB", async () => {
    mockGetPaymentStatus.mockResolvedValue({ status: "approved" });
    mockPaymentFindFirst.mockResolvedValue(null);

    const req = createWebhookRequest({
      type: "payment",
      data: { id: "unknown-123" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Payment not found");
  });

  it("should ignore non-payment webhook types", async () => {
    const req = createWebhookRequest({
      type: "merchant_order",
      data: { id: "12345" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.received).toBe(true);
    expect(mockGetPaymentStatus).not.toHaveBeenCalled();
  });

  it("should return 500 on internal error", async () => {
    mockGetPaymentStatus.mockRejectedValue(new Error("API down"));

    const req = createWebhookRequest({
      type: "payment",
      data: { id: "mp-12345" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Webhook processing failed");
  });
});
