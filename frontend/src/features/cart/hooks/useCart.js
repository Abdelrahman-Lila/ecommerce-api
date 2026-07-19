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

const normalizeItem = (item) => {
  const id = item?.id ?? item?.productId ?? item?._id;

  return {
    id,
    title: item?.title ?? "Untitled item",
    price: Number(item?.price ?? 0),
    image: item?.image ?? item?.imageCover ?? "",
    quantity: Number(item?.quantity ?? 1),
    stock: Number(item?.stock ?? item?.quantity ?? 0),
    category: item?.category ?? null,
    brand: item?.brand ?? null,
  };
};

const writeCart = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT_NAME));
};

export const useCart = () => {
  const [items, setItems] = useState(() => readCart().map(normalizeItem));

  useEffect(() => {
    const syncCart = () => setItems(readCart().map(normalizeItem));

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
    const normalizedItems = resolvedItems.map(normalizeItem);
    writeCart(normalizedItems);
    setItems(normalizedItems);
  };

  const addItem = (item) => {
    const currentItems = readCart();
    const nextItem = normalizeItem(item);
    const existingItem = currentItems.find(
      (current) => current.id === nextItem.id,
    );

    const nextItems = existingItem
      ? currentItems.map((current) =>
          current.id === nextItem.id
            ? {
                ...current,
                quantity: Math.min(
                  (current.quantity ?? 0) + nextItem.quantity,
                  current.stock || Infinity,
                ),
              }
            : current,
        )
      : [...currentItems, nextItem];

    writeCart(nextItems);
    setItems(nextItems);
  };

  const updateItemQuantity = (itemId, quantity) => {
    const nextItems = readCart()
      .map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(Number(quantity), item.stock || Number(quantity)),
              ),
            }
          : item,
      )
      .filter(Boolean);
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
