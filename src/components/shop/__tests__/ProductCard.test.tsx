import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "../ProductCard";

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

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockAddItem = jest.fn();
jest.mock("@/stores/cart-store", () => ({
  useCartStore: (selector: any) => {
    const store = {
      addItem: mockAddItem,
    };
    return selector(store);
  },
  CartProduct: {},
}));

const baseProduct = {
  id: "prod-1",
  name: "Sérum Vitamina C",
  slug: "serum-vitamina-c",
  price: 89.9,
  compareAtPrice: 119.9,
  images: [{ url: "/images/serum.jpg", alt: "Sérum" }],
  category: { name: "Skincare", slug: "skincare" },
  stock: 10,
  rating: 4.5,
  reviewCount: 23,
  isNew: true,
  isFeatured: true,
};

describe("ProductCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render product name", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("Sérum Vitamina C")).toBeInTheDocument();
  });

  it("should render product price", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText(/R\$\s*89,90/)).toBeInTheDocument();
  });

  it("should render compare at price when available", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText(/R\$\s*119,90/)).toBeInTheDocument();
  });

  it("should render discount badge", () => {
    render(<ProductCard product={baseProduct} />);
    // discount = Math.round((1 - 89.9 / 119.9) * 100) = 25%
    expect(screen.getByText("-25%")).toBeInTheDocument();
  });

  it("should render 'Novo' badge for new products", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("Novo")).toBeInTheDocument();
  });

  it("should not render 'Novo' badge for non-new products", () => {
    render(<ProductCard product={{ ...baseProduct, isNew: false }} />);
    expect(screen.queryByText("Novo")).not.toBeInTheDocument();
  });

  it("should not render discount badge when no compareAtPrice", () => {
    render(
      <ProductCard
        product={{ ...baseProduct, compareAtPrice: null }}
      />
    );
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });

  it("should render category name", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("Skincare")).toBeInTheDocument();
  });

  it("should link to product page", () => {
    render(<ProductCard product={baseProduct} />);
    const links = screen.getAllByRole("link");
    const productLink = links.find(
      (l) => l.getAttribute("href") === "/produto/serum-vitamina-c"
    );
    expect(productLink).toBeInTheDocument();
  });

  it("should link to category page", () => {
    render(<ProductCard product={baseProduct} />);
    const categoryLink = screen.getByText("Skincare").closest("a");
    expect(categoryLink).toHaveAttribute("href", "/categoria/skincare");
  });

  it("should show stock status for in-stock products", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("Em estoque (10)")).toBeInTheDocument();
  });

  it("should show out-of-stock status", () => {
    render(<ProductCard product={{ ...baseProduct, stock: 0 }} />);
    expect(screen.getByText("Fora de estoque")).toBeInTheDocument();
  });

  it("should show rating when > 0", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("4.5 (23)")).toBeInTheDocument();
  });

  it("should not show rating when 0", () => {
    render(
      <ProductCard
        product={{ ...baseProduct, rating: 0, reviewCount: 0 }}
      />
    );
    expect(screen.queryByText(/\d+\.\d+ \(\d+\)/)).not.toBeInTheDocument();
  });

  it("should call addItem when add to cart is clicked", () => {
    render(<ProductCard product={baseProduct} />);

    const addButtons = screen.getAllByText("Adicionar");
    fireEvent.click(addButtons[0]);

    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "prod-1",
        name: "Sérum Vitamina C",
        slug: "serum-vitamina-c",
        price: 89.9,
      })
    );
  });

  it("should use fallback image when no images", () => {
    render(
      <ProductCard product={{ ...baseProduct, images: [] }} />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      "/images/product-progressiva-gold.jpg"
    );
  });

  it("should apply custom className", () => {
    const { container } = render(
      <ProductCard product={baseProduct} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
