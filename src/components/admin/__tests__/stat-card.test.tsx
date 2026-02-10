import { render, screen } from "@testing-library/react";
import { StatCard } from "../stat-card";
import { Package } from "lucide-react";

describe("StatCard", () => {
  const baseProps = {
    label: "Total Produtos",
    value: "150",
    icon: Package,
    color: "text-purple-600",
    bg: "bg-purple-100",
  };

  it("should render label text", () => {
    render(<StatCard {...baseProps} />);
    expect(screen.getByText("Total Produtos")).toBeInTheDocument();
  });

  it("should render value", () => {
    render(<StatCard {...baseProps} />);
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("should render positive trend with green text", () => {
    render(
      <StatCard
        {...baseProps}
        trend={{ value: 12.5, label: "vs mes anterior" }}
      />
    );
    expect(screen.getByText("+12.5%")).toBeInTheDocument();
    expect(screen.getByText("vs mes anterior")).toBeInTheDocument();
  });

  it("should render negative trend with red text", () => {
    render(
      <StatCard
        {...baseProps}
        trend={{ value: -8.3, label: "vs mes anterior" }}
      />
    );
    expect(screen.getByText("-8.3%")).toBeInTheDocument();
  });

  it("should not render trend section when trend is undefined", () => {
    render(<StatCard {...baseProps} />);
    expect(screen.queryByText("%")).not.toBeInTheDocument();
  });

  it("should format trend percentage with one decimal", () => {
    render(
      <StatCard
        {...baseProps}
        trend={{ value: 0, label: "sem variacao" }}
      />
    );
    expect(screen.getByText("+0.0%")).toBeInTheDocument();
  });
});
