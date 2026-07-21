const base64UrlDecode = (value) => {
  const normalizedValue = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddedValue = normalizedValue.padEnd(
    normalizedValue.length + ((4 - (normalizedValue.length % 4)) % 4),
    "=",
  );

  return atob(paddedValue);
};

export const decodeAccessToken = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeAccessToken(token);

  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
};

export const getTokenUser = (token) => {
  const payload = decodeAccessToken(token);

  if (!payload || isTokenExpired(token)) {
    return null;
  }

  const role =
    payload.role === "admin" || payload.isAdmin === true ? "admin" : "user";

  return {
    id: payload.id ?? null,
    email: payload.email ?? null,
    role,
  };
};
