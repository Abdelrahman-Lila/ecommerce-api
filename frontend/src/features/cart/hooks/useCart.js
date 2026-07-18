import { useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "cartItems";
const CART_EVENT_NAME = "cart:change";

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const writeCart = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT_NAME));
};

export const useCart = () => {
  const [items, setItems] = useState(() => readCart());

  useEffect(() => {
    const syncCart = () => setItems(readCart());

    window.addEventListener("storage", syncCart);
    window.addEventListener(CART_EVENT_NAME, syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(CART_EVENT_NAME, syncCart);
    };
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + (item.quantity ?? 0), 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + (item.quantity ?? 0) * (item.price ?? 0),
        0,
      ),
    [items],
  );

  const setCartItems = (nextItems) => {
    const resolvedItems =
      typeof nextItems === "function" ? nextItems(readCart()) : nextItems;
    writeCart(resolvedItems);
    setItems(resolvedItems);
  };

  const addItem = (item) => {
    const currentItems = readCart();
    const nextItems = [...currentItems, item];
    writeCart(nextItems);
    setItems(nextItems);
  };

  const updateItemQuantity = (itemId, quantity) => {
    const nextItems = readCart().map((item) =>
      item.id === itemId ? { ...item, quantity } : item,
    );
    writeCart(nextItems);
    setItems(nextItems);
  };

  const removeItem = (itemId) => {
    const nextItems = readCart().filter((item) => item.id !== itemId);
    writeCart(nextItems);
    setItems(nextItems);
  };

  const clearCart = () => {
    writeCart([]);
    setItems([]);
  };

  return {
    items,
    itemCount,
    subtotal,
    setCartItems,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
  };
};
