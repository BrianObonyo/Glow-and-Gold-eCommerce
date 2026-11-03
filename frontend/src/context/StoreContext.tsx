import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, type CartItem } from "../lib/api";

interface Store {
  loggedIn: boolean;
  items: CartItem[];
  count: number;
  totalCents: number;
  login: (token: string) => void;
  logout: () => void;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  setQuantity: (productId: string, quantity: number) => Promise<void>;
  notify: (message: string) => void;
}

const StoreCtx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [items, setItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>();

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setItems([]);
      return;
    }
    try {
      const res = await api.getCart();
      setItems(res.cart?.items ?? []);
    } catch {
      // Expired or invalid token: treat as logged out.
      localStorage.removeItem("token");
      setToken(null);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void refreshCart();
  }, [token, refreshCart]);

  const value = useMemo<Store>(
    () => ({
      loggedIn: Boolean(token),
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      totalCents: items.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0),
      login: (t) => {
        localStorage.setItem("token", t);
        setToken(t);
      },
      logout: () => {
        localStorage.removeItem("token");
        setToken(null);
        setItems([]);
      },
      refreshCart,
      addToCart: async (productId, quantity = 1) => {
        await api.addToCart(productId, quantity);
        await refreshCart();
        notify("Added to your bag");
      },
      setQuantity: async (productId, quantity) => {
        await api.updateCartItem(productId, quantity);
        await refreshCart();
      },
      notify,
    }),
    [token, items, refreshCart, notify],
  );

  return (
    <StoreCtx.Provider value={value}>
      {children}
      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
