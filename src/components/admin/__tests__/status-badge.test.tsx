import { render, screen } from "@testing-library/react";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  PaymentMethodBadge,
} from "../status-badge";

describe("OrderStatusBadge", () => {
  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    PROCESSING: "Em preparo",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
    REFUNDED: "Reembolsado",
  };

  for (const [status, label] of Object.entries(statusLabels)) {
    it(`should render '${label}' for ${status} status`, () => {
      render(<OrderStatusBadge status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  }

  it("should render raw status string for unknown status", () => {
    render(<OrderStatusBadge status="UNKNOWN_STATUS" />);
    expect(screen.getByText("UNKNOWN_STATUS")).toBeInTheDocument();
  });
});

describe("PaymentStatusBadge", () => {
  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    PROCESSING: "Processando",
    PAID: "Pago",
    FAILED: "Falhou",
    REFUNDED: "Reembolsado",
    CANCELLED: "Cancelado",
  };

  for (const [status, label] of Object.entries(statusLabels)) {
    it(`should render '${label}' for ${status}`, () => {
      render(<PaymentStatusBadge status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  }

  it("should render raw status for unknown", () => {
    render(<PaymentStatusBadge status="WEIRD" />);
    expect(screen.getByText("WEIRD")).toBeInTheDocument();
  });
});

describe("PaymentMethodBadge", () => {
  it("should render 'PIX' for PIX", () => {
    render(<PaymentMethodBadge method="PIX" />);
    expect(screen.getByText("PIX")).toBeInTheDocument();
  });

  it("should render 'Cartao' for CREDIT_CARD", () => {
    render(<PaymentMethodBadge method="CREDIT_CARD" />);
    expect(screen.getByText("Cartao")).toBeInTheDocument();
  });

  it("should render 'Boleto' for BOLETO", () => {
    render(<PaymentMethodBadge method="BOLETO" />);
    expect(screen.getByText("Boleto")).toBeInTheDocument();
  });

  it("should render raw method for unknown", () => {
    render(<PaymentMethodBadge method="CRYPTO" />);
    expect(screen.getByText("CRYPTO")).toBeInTheDocument();
  });
});
