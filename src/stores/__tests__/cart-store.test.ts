import { useCartStore, CartProduct } from "../cart-store";
import { act } from "@testing-library/react";

const mockProduct: CartProduct = {
  id: "prod-1",
  name: "Sérum Vitamina C",
  slug: "serum-vitamina-c",
  price: 89.9,
  originalPrice: 119.9,
  image: "/images/products/serum-vitamina-c.jpg",
  stock: 10,
};

const mockProduct2: CartProduct = {
  id: "prod-2",
  name: "Protetor Solar FPS 50",
  slug: "protetor-solar-fps-50",
  price: 59.9,
  image: "/images/products/protetor-solar.jpg",
  stock: 5,
};

describe("Cart Store", () => {
  beforeEach(() => {
    act(() => {
      useCartStore.getState().clearCart();
    });
  });

  it("should start with empty cart", () => {
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.totalItems()).toBe(0);
    expect(state.totalPrice()).toBe(0);
  });

  it("should add item to cart", () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
    });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe("prod-1");
    expect(state.items[0].quantity).toBe(1);
  });

  it("should increment quantity when adding existing item", () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct);
    });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it("should add custom quantity", () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct, 3);
    });

    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(3);
  });

  it("should remove item from cart", () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct2);
      useCartStore.getState().removeItem("prod-1");
    });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe("prod-2");
  });

  it("should update item quantity", () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().updateQuantity("prod-1", 5);
    });

    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(5);
  });

  it("should remove item when quantity is set to 0", () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().updateQuantity("prod-1", 0);
    });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it("should clear entire cart", () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct2);
      useCartStore.getState().clearCart();
    });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it("should calculate total items correctly", () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct, 2);
      useCartStore.getState().addItem(mockProduct2, 3);
    });

    expect(useCartStore.getState().totalItems()).toBe(5);
  });

  it("should calculate total price correctly", () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct, 2); // 89.9 * 2 = 179.8
      useCartStore.getState().addItem(mockProduct2, 1); // 59.9 * 1 = 59.9
    });

    const total = useCartStore.getState().totalPrice();
    expect(total).toBeCloseTo(239.7, 2);
  });

  it("should calculate subtotal correctly", () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct, 1);
    });

    expect(useCartStore.getState().subtotal()).toBeCloseTo(89.9, 2);
  });

  it("should toggle cart open state", () => {
    expect(useCartStore.getState().isOpen).toBe(false);

    act(() => {
      useCartStore.getState().setIsOpen(true);
    });

    expect(useCartStore.getState().isOpen).toBe(true);

    act(() => {
      useCartStore.getState().setIsOpen(false);
    });

    expect(useCartStore.getState().isOpen).toBe(false);
  });
});
