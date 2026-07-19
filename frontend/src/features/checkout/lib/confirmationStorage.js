const LAST_ORDER_KEY = "latestOrderConfirmation";

export const saveLatestOrderConfirmation = (order) => {
  localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
};

export const readLatestOrderConfirmation = () => {
  try {
    return JSON.parse(localStorage.getItem(LAST_ORDER_KEY) ?? "null");
  } catch {
    return null;
  }
};

export const clearLatestOrderConfirmation = () => {
  localStorage.removeItem(LAST_ORDER_KEY);
};
