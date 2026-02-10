import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export const payment = new Payment(client);
export const preference = new Preference(client);

interface CreatePaymentInput {
  orderId: string;
  orderNumber: string;
  amount: number;
  description: string;
  payerEmail: string;
  payerName: string;
  payerCpf?: string;
  method: "pix" | "credit_card" | "boleto";
  installments?: number;
  cardToken?: string;
}

export async function createPixPayment(input: CreatePaymentInput) {
  const result = await payment.create({
    body: {
      transaction_amount: input.amount,
      description: input.description,
      payment_method_id: "pix",
      payer: {
        email: input.payerEmail,
        first_name: input.payerName.split(" ")[0],
        last_name: input.payerName.split(" ").slice(1).join(" "),
      },
      external_reference: input.orderId,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    },
  });

  return {
    externalId: String(result.id),
    pixCode: result.point_of_interaction?.transaction_data?.qr_code ?? null,
    pixQrCode:
      result.point_of_interaction?.transaction_data?.qr_code_base64 ?? null,
    pixExpiresAt: result.date_of_expiration
      ? new Date(result.date_of_expiration)
      : null,
    status: result.status,
  };
}

export async function createCardPayment(input: CreatePaymentInput) {
  const result = await payment.create({
    body: {
      transaction_amount: input.amount,
      description: input.description,
      payment_method_id: "visa",
      installments: input.installments || 1,
      token: input.cardToken!,
      payer: {
        email: input.payerEmail,
      },
      external_reference: input.orderId,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    },
  });

  return {
    externalId: String(result.id),
    cardLastFour: result.card?.last_four_digits ?? null,
    cardBrand: result.payment_method_id ?? null,
    installments: result.installments ?? 1,
    status: result.status,
  };
}

export async function createBoletoPayment(input: CreatePaymentInput) {
  const result = await payment.create({
    body: {
      transaction_amount: input.amount,
      description: input.description,
      payment_method_id: "bolbradesco",
      payer: {
        email: input.payerEmail,
        first_name: input.payerName.split(" ")[0],
        last_name: input.payerName.split(" ").slice(1).join(" "),
        identification: input.payerCpf
          ? { type: "CPF", number: input.payerCpf }
          : undefined,
      },
      external_reference: input.orderId,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    },
  });

  return {
    externalId: String(result.id),
    boletoUrl:
      result.transaction_details?.external_resource_url ?? null,
    boletoBarcode: (result as any).barcode?.content ?? null,
    boletoDueDate: result.date_of_expiration
      ? new Date(result.date_of_expiration)
      : null,
    status: result.status,
  };
}

export async function getPaymentStatus(paymentId: string) {
  const result = await payment.get({ id: paymentId });
  return {
    status: result.status,
    statusDetail: result.status_detail,
  };
}
