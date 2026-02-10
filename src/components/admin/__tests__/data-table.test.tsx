import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable, ColumnDef } from "../data-table";

interface TestItem {
  id: string;
  name: string;
  price: number;
}

const testColumns: ColumnDef<TestItem>[] = [
  {
    key: "name",
    header: "Nome",
    cell: (item) => item.name,
    sortable: true,
  },
  {
    key: "price",
    header: "Preco",
    cell: (item) => `R$ ${item.price}`,
    sortable: true,
  },
];

function generateItems(count: number): TestItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Product ${String.fromCharCode(65 + (i % 26))}${i}`,
    price: (i + 1) * 10,
  }));
}

describe("DataTable", () => {
  describe("Rendering", () => {
    it("should render table headers", () => {
      render(<DataTable data={[]} columns={testColumns} />);
      expect(screen.getByText("Nome")).toBeInTheDocument();
      expect(screen.getByText("Preco")).toBeInTheDocument();
    });

    it("should render all visible rows for first page", () => {
      const data = generateItems(3);
      render(<DataTable data={data} columns={testColumns} pageSize={10} />);

      expect(screen.getByText("Product A0")).toBeInTheDocument();
      expect(screen.getByText("Product B1")).toBeInTheDocument();
      expect(screen.getByText("Product C2")).toBeInTheDocument();
    });

    it("should show empty state message for empty data", () => {
      render(<DataTable data={[]} columns={testColumns} />);
      expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
    });

    it("should show result count text", () => {
      const data = generateItems(5);
      render(<DataTable data={data} columns={testColumns} pageSize={10} />);
      expect(screen.getByText(/1 a 5 de 5/)).toBeInTheDocument();
    });
  });

  describe("Search", () => {
    it("should render search input when searchKey is provided", () => {
      render(
        <DataTable
          data={generateItems(3)}
          columns={testColumns}
          searchKey="name"
          searchPlaceholder="Buscar produto..."
        />
      );
      expect(screen.getByPlaceholderText("Buscar produto...")).toBeInTheDocument();
    });

    it("should not render search input when searchKey is absent", () => {
      render(<DataTable data={generateItems(3)} columns={testColumns} />);
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("should filter rows based on search input", () => {
      const data = [
        { id: "1", name: "Shampoo", price: 30 },
        { id: "2", name: "Condicionador", price: 25 },
        { id: "3", name: "Creme", price: 40 },
      ];
      render(
        <DataTable data={data} columns={testColumns} searchKey="name" />
      );

      const input = screen.getByPlaceholderText("Buscar...");
      fireEvent.change(input, { target: { value: "Shampoo" } });

      expect(screen.getByText("Shampoo")).toBeInTheDocument();
      expect(screen.queryByText("Condicionador")).not.toBeInTheDocument();
      expect(screen.queryByText("Creme")).not.toBeInTheDocument();
    });

    it("should show empty state when search matches nothing", () => {
      const data = [{ id: "1", name: "Shampoo", price: 30 }];
      render(
        <DataTable data={data} columns={testColumns} searchKey="name" />
      );

      const input = screen.getByPlaceholderText("Buscar...");
      fireEvent.change(input, { target: { value: "xyz" } });

      expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("should paginate data according to pageSize", () => {
      const data = generateItems(12);
      render(<DataTable data={data} columns={testColumns} pageSize={5} />);

      expect(screen.getByText(/1 a 5 de 12/)).toBeInTheDocument();
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("should navigate to next page on Next click", () => {
      const data = generateItems(12);
      render(<DataTable data={data} columns={testColumns} pageSize={5} />);

      const nextButton = screen.getAllByRole("button").find(
        (btn) => !btn.textContent?.includes("Nome") && !btn.textContent?.includes("Preco")
      );
      // Find the right arrow button (last navigation button)
      const buttons = screen.getAllByRole("button");
      const nextBtn = buttons[buttons.length - 1];
      fireEvent.click(nextBtn);

      expect(screen.getByText("2 / 3")).toBeInTheDocument();
      expect(screen.getByText(/6 a 10 de 12/)).toBeInTheDocument();
    });

    it("should navigate to previous page", () => {
      const data = generateItems(12);
      render(<DataTable data={data} columns={testColumns} pageSize={5} />);

      const buttons = screen.getAllByRole("button");
      const nextBtn = buttons[buttons.length - 1];
      const prevBtn = buttons[buttons.length - 2];

      // Go to page 2
      fireEvent.click(nextBtn);
      expect(screen.getByText("2 / 3")).toBeInTheDocument();

      // Go back to page 1
      fireEvent.click(prevBtn);
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });
  });

  describe("Sorting", () => {
    it("should sort ascending on first click", () => {
      const data = [
        { id: "1", name: "Creme", price: 40 },
        { id: "2", name: "Agua", price: 10 },
        { id: "3", name: "Batom", price: 20 },
      ];
      render(<DataTable data={data} columns={testColumns} />);

      const nameButton = screen.getByText("Nome");
      fireEvent.click(nameButton);

      const cells = screen.getAllByRole("cell");
      // After ascending sort: Agua, Batom, Creme
      expect(cells[0].textContent).toBe("Agua");
    });

    it("should toggle to descending on second click", () => {
      const data = [
        { id: "1", name: "Creme", price: 40 },
        { id: "2", name: "Agua", price: 10 },
        { id: "3", name: "Batom", price: 20 },
      ];
      render(<DataTable data={data} columns={testColumns} />);

      const nameButton = screen.getByText("Nome");
      fireEvent.click(nameButton); // asc
      fireEvent.click(nameButton); // desc

      const cells = screen.getAllByRole("cell");
      // After descending sort: Creme, Batom, Agua
      expect(cells[0].textContent).toBe("Creme");
    });
  });
});
