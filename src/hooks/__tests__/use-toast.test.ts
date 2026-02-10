import { reducer } from "../use-toast";

type ToasterToast = {
  id: string;
  open?: boolean;
  title?: string;
  [key: string]: any;
};

interface State {
  toasts: ToasterToast[];
}

describe("toast reducer", () => {
  const emptyState: State = { toasts: [] };

  describe("ADD_TOAST", () => {
    it("should add a toast", () => {
      const toast: ToasterToast = { id: "1", title: "Hello" };
      const result = reducer(emptyState, { type: "ADD_TOAST", toast });

      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0].id).toBe("1");
      expect(result.toasts[0].title).toBe("Hello");
    });

    it("should prepend new toast (newest first)", () => {
      const state: State = {
        toasts: [{ id: "1", title: "First" }],
      };
      const toast: ToasterToast = { id: "2", title: "Second" };
      const result = reducer(state, { type: "ADD_TOAST", toast });

      expect(result.toasts[0].id).toBe("2");
    });

    it("should enforce toast limit of 1", () => {
      const state: State = {
        toasts: [{ id: "1", title: "First" }],
      };
      const toast: ToasterToast = { id: "2", title: "Second" };
      const result = reducer(state, { type: "ADD_TOAST", toast });

      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0].id).toBe("2");
    });
  });

  describe("UPDATE_TOAST", () => {
    it("should update existing toast", () => {
      const state: State = {
        toasts: [{ id: "1", title: "Original" }],
      };
      const result = reducer(state, {
        type: "UPDATE_TOAST",
        toast: { id: "1", title: "Updated" },
      });

      expect(result.toasts[0].title).toBe("Updated");
    });

    it("should not modify other toasts", () => {
      const state: State = {
        toasts: [{ id: "1", title: "Keep" }],
      };
      const result = reducer(state, {
        type: "UPDATE_TOAST",
        toast: { id: "2", title: "Nope" },
      });

      expect(result.toasts[0].title).toBe("Keep");
    });
  });

  describe("DISMISS_TOAST", () => {
    it("should set open to false for specific toast", () => {
      const state: State = {
        toasts: [{ id: "1", title: "Test", open: true }],
      };
      const result = reducer(state, {
        type: "DISMISS_TOAST",
        toastId: "1",
      });

      expect(result.toasts[0].open).toBe(false);
    });

    it("should dismiss all toasts when no id provided", () => {
      const state: State = {
        toasts: [{ id: "1", open: true }],
      };
      const result = reducer(state, { type: "DISMISS_TOAST" });

      expect(result.toasts[0].open).toBe(false);
    });
  });

  describe("REMOVE_TOAST", () => {
    it("should remove specific toast", () => {
      const state: State = {
        toasts: [{ id: "1", title: "Remove me" }],
      };
      const result = reducer(state, {
        type: "REMOVE_TOAST",
        toastId: "1",
      });

      expect(result.toasts).toHaveLength(0);
    });

    it("should remove all toasts when no id provided", () => {
      const state: State = {
        toasts: [{ id: "1" }],
      };
      const result = reducer(state, { type: "REMOVE_TOAST" });

      expect(result.toasts).toHaveLength(0);
    });

    it("should not remove non-matching toast", () => {
      const state: State = {
        toasts: [{ id: "1", title: "Keep" }],
      };
      const result = reducer(state, {
        type: "REMOVE_TOAST",
        toastId: "99",
      });

      expect(result.toasts).toHaveLength(1);
    });
  });
});
