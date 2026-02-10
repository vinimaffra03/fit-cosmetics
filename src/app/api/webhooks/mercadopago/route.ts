import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getPaymentStatus } from "@/lib/payments/mercadopago";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type === "payment") {
      const paymentId = String(body.data.id);
      const { status } = await getPaymentStatus(paymentId);

      const dbPayment = await prisma.payment.findFirst({
        where: { externalId: paymentId },
        include: { order: true },
      });

      if (!dbPayment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }

      let paymentStatus: "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED" = "PENDING";
      let orderStatus: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED" = "PENDING";

      switch (status) {
        case "approved":
          paymentStatus = "PAID";
          orderStatus = "CONFIRMED";
          break;
        case "pending":
        case "in_process":
          paymentStatus = "PROCESSING";
          orderStatus = "PENDING";
          break;
        case "rejected":
          paymentStatus = "FAILED";
          orderStatus = "CANCELLED";
          break;
        case "refunded":
          paymentStatus = "REFUNDED";
          orderStatus = "REFUNDED";
          break;
        case "cancelled":
          paymentStatus = "CANCELLED";
          orderStatus = "CANCELLED";
          break;
      }

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: dbPayment.id },
          data: {
            status: paymentStatus,
            paidAt: paymentStatus === "PAID" ? new Date() : null,
          },
        }),
        prisma.order.update({
          where: { id: dbPayment.orderId },
          data: { status: orderStatus },
        }),
      ]);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
