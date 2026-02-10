import { render, screen } from "@testing-library/react";
import CartDrawer from "../CartDrawer";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} data-fill={fill ? "true" : undefined} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockSetIsOpen = jest.fn();
const mockRemoveItem = jest.fn();
const mockUpdateQuantity = jest.fn();

let mockStoreState = {
  items: [] as any[],
  isOpen: true,
  setIsOpen: mockSetIsOpen,
  removeItem: mockRemoveItem,
  updateQuantity: mockUpdateQuantity,
  totalPrice: () => 0,
  totalItems: () => 0,
};

jest.mock("@/stores/cart-store", () => ({
  useCartStore: (selector: any) => selector(mockStoreState),
}));

const mockItem = {
  product: {
    id: "prod-1",
    name: "Sérum Vitamina C",
    slug: "serum-vitamina-c",
    price: 89.9,
    image: "/images/serum.jpg",
    stock: 10,
  },
  quantity: 2,
};

describe("CartDrawer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreState = {
      items: [],
      isOpen: true,
      setIsOpen: mockSetIsOpen,
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
      totalPrice: () => 0,
      totalItems: () => 0,
    };
  });

  it("should render empty cart message", () => {
    render(<CartDrawer />);
    expect(screen.getByText("Seu carrinho está vazio")).toBeInTheDocument();
  });

  it("should show 'Ver Produtos' link when empty", () => {
    render(<CartDrawer />);
    const link = screen.getByText("Ver Produtos");
    expect(link.closest("a")).toHaveAttribute("href", "/produtos");
  });

  it("should render cart title", () => {
    render(<CartDrawer />);
    expect(screen.getByText("Seu Carrinho")).toBeInTheDocument();
  });

  it("should render items when cart has products", () => {
    mockStoreState.items = [mockItem];
    mockStoreState.totalPrice = () => 179.8;
    mockStoreState.totalItems = () => 2;

    render(<CartDrawer />);
    expect(screen.getByText("Sérum Vitamina C")).toBeInTheDocument();
  });

  it("should show item count in header", () => {
    mockStoreState.items = [mockItem];
    mockStoreState.totalItems = () => 2;
    mockStoreState.totalPrice = () => 179.8;

    render(<CartDrawer />);
    expect(screen.getByText("(2 itens)")).toBeInTheDocument();
  });

  it("should show singular 'item' for count of 1", () => {
    mockStoreState.items = [{ ...mockItem, quantity: 1 }];
    mockStoreState.totalItems = () => 1;
    mockStoreState.totalPrice = () => 89.9;

    render(<CartDrawer />);
    expect(screen.getByText("(1 item)")).toBeInTheDocument();
  });

  it("should show free shipping when total >= 199", () => {
    mockStoreState.items = [mockItem];
    mockStoreState.totalPrice = () => 250;
    mockStoreState.totalItems = () => 1;

    render(<CartDrawer />);
    expect(screen.getByText("Grátis")).toBeInTheDocument();
  });

  it("should show 'Calcular no checkout' when total < 199", () => {
    mockStoreState.items = [mockItem];
    mockStoreState.totalPrice = () => 89.9;
    mockStoreState.totalItems = () => 1;

    render(<CartDrawer />);
    expect(screen.getByText("Calcular no checkout")).toBeInTheDocument();
  });

  it("should render checkout link", () => {
    mockStoreState.items = [mockItem];
    mockStoreState.totalPrice = () => 89.9;
    mockStoreState.totalItems = () => 1;

    render(<CartDrawer />);
    const checkoutLink = screen.getByText("Finalizar Compra");
    expect(checkoutLink.closest("a")).toHaveAttribute("href", "/checkout");
  });

  it("should show item quantity", () => {
    mockStoreState.items = [mockItem];
    mockStoreState.totalPrice = () => 179.8;
    mockStoreState.totalItems = () => 2;

    render(<CartDrawer />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
