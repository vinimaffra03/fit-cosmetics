jest.mock("mercadopago", () => ({
  MercadoPagoConfig: jest.fn(),
  Payment: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    get: jest.fn(),
  })),
  Preference: jest.fn(),
}));

import {
  payment,
  createPixPayment,
  createCardPayment,
  createBoletoPayment,
  getPaymentStatus,
} from "../mercadopago";

const mockCreate = payment.create as jest.Mock;
const mockGet = payment.get as jest.Mock;

const baseInput = {
  orderId: "order-123",
  orderNumber: "FIT-001",
  amount: 89.9,
  description: "Sérum Vitamina C",
  payerEmail: "maria@example.com",
  payerName: "Maria Silva",
  method: "pix" as const,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createPixPayment", () => {
  it("should create PIX payment and return formatted result", async () => {
    mockCreate.mockResolvedValue({
      id: 12345,
      point_of_interaction: {
        transaction_data: {
          qr_code: "pix-code-123",
          qr_code_base64: "base64-qr-code",
        },
      },
      date_of_expiration: "2025-12-31T23:59:59Z",
      status: "pending",
    });

    const result = await createPixPayment(baseInput);

    expect(result.externalId).toBe("12345");
    expect(result.pixCode).toBe("pix-code-123");
    expect(result.pixQrCode).toBe("base64-qr-code");
    expect(result.pixExpiresAt).toBeInstanceOf(Date);
    expect(result.status).toBe("pending");
  });

  it("should handle missing QR code data", async () => {
    mockCreate.mockResolvedValue({
      id: 12346,
      point_of_interaction: {},
      status: "pending",
    });

    const result = await createPixPayment(baseInput);

    expect(result.pixCode).toBeNull();
    expect(result.pixQrCode).toBeNull();
  });

  it("should handle missing expiration date", async () => {
    mockCreate.mockResolvedValue({
      id: 12347,
      point_of_interaction: {
        transaction_data: { qr_code: "code", qr_code_base64: "base64" },
      },
      status: "pending",
    });

    const result = await createPixPayment(baseInput);

    expect(result.pixExpiresAt).toBeNull();
  });

  it("should split payer name into first and last name", async () => {
    mockCreate.mockResolvedValue({ id: 1, status: "pending" });

    await createPixPayment({
      ...baseInput,
      payerName: "João Carlos da Silva",
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          payer: expect.objectContaining({
            first_name: "João",
            last_name: "Carlos da Silva",
          }),
        }),
      })
    );
  });
});

describe("createCardPayment", () => {
  it("should create credit card payment", async () => {
    mockCreate.mockResolvedValue({
      id: 99999,
      card: { last_four_digits: "4242" },
      payment_method_id: "visa",
      installments: 3,
      status: "approved",
    });

    const result = await createCardPayment({
      ...baseInput,
      method: "credit_card",
      cardToken: "card-token-abc",
      installments: 3,
    });

    expect(result.externalId).toBe("99999");
    expect(result.cardLastFour).toBe("4242");
    expect(result.cardBrand).toBe("visa");
    expect(result.installments).toBe(3);
    expect(result.status).toBe("approved");
  });

  it("should handle missing card info", async () => {
    mockCreate.mockResolvedValue({
      id: 99998,
      status: "pending",
    });

    const result = await createCardPayment({
      ...baseInput,
      method: "credit_card",
      cardToken: "token",
    });

    expect(result.cardLastFour).toBeNull();
    expect(result.cardBrand).toBeNull();
    expect(result.installments).toBe(1);
  });
});

describe("createBoletoPayment", () => {
  it("should create boleto payment", async () => {
    mockCreate.mockResolvedValue({
      id: 88888,
      transaction_details: {
        external_resource_url: "https://boleto.url/123",
      },
      barcode: { content: "12345.67890 12345.678901 12345.678901 1 12340000008990" },
      date_of_expiration: "2025-12-31T23:59:59Z",
      status: "pending",
    });

    const result = await createBoletoPayment({
      ...baseInput,
      method: "boleto",
      payerCpf: "12345678900",
    });

    expect(result.externalId).toBe("88888");
    expect(result.boletoUrl).toBe("https://boleto.url/123");
    expect(result.boletoBarcode).toBe(
      "12345.67890 12345.678901 12345.678901 1 12340000008990"
    );
    expect(result.boletoDueDate).toBeInstanceOf(Date);
    expect(result.status).toBe("pending");
  });

  it("should handle missing boleto details", async () => {
    mockCreate.mockResolvedValue({
      id: 88887,
      status: "pending",
    });

    const result = await createBoletoPayment({
      ...baseInput,
      method: "boleto",
    });

    expect(result.boletoUrl).toBeNull();
    expect(result.boletoBarcode).toBeNull();
    expect(result.boletoDueDate).toBeNull();
  });

  it("should include CPF identification when provided", async () => {
    mockCreate.mockResolvedValue({ id: 1, status: "pending" });

    await createBoletoPayment({
      ...baseInput,
      method: "boleto",
      payerCpf: "12345678900",
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          payer: expect.objectContaining({
            identification: { type: "CPF", number: "12345678900" },
          }),
        }),
      })
    );
  });

  it("should omit identification when no CPF", async () => {
    mockCreate.mockResolvedValue({ id: 1, status: "pending" });

    await createBoletoPayment({
      ...baseInput,
      method: "boleto",
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          payer: expect.objectContaining({
            identification: undefined,
          }),
        }),
      })
    );
  });
});

describe("getPaymentStatus", () => {
  it("should return payment status", async () => {
    mockGet.mockResolvedValue({
      status: "approved",
      status_detail: "accredited",
    });

    const result = await getPaymentStatus("12345");

    expect(result.status).toBe("approved");
    expect(result.statusDetail).toBe("accredited");
    expect(mockGet).toHaveBeenCalledWith({ id: "12345" });
  });

  it("should return pending status", async () => {
    mockGet.mockResolvedValue({
      status: "pending",
      status_detail: "pending_waiting_transfer",
    });

    const result = await getPaymentStatus("99999");

    expect(result.status).toBe("pending");
    expect(result.statusDetail).toBe("pending_waiting_transfer");
  });
});
