const ACTIVE_CHECKOUT_SESSION_KEY = "activeCheckoutSessionId";

export const saveActiveCheckoutSession = (sessionId) => {
  sessionStorage.setItem(ACTIVE_CHECKOUT_SESSION_KEY, sessionId);
};

export const isActiveCheckoutSession = (sessionId) =>
  sessionStorage.getItem(ACTIVE_CHECKOUT_SESSION_KEY) === sessionId;

export const clearActiveCheckoutSession = () => {
  sessionStorage.removeItem(ACTIVE_CHECKOUT_SESSION_KEY);
};
