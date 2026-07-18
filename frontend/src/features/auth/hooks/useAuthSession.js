import { useEffect, useState } from "react";
import { AUTH_CHANGE_EVENT, getAuthSession } from "../lib/authStorage.js";

export const useAuthSession = () => {
  const [session, setSession] = useState(() => getAuthSession());

  useEffect(() => {
    const syncSession = () => setSession(getAuthSession());

    window.addEventListener("storage", syncSession);
    window.addEventListener(AUTH_CHANGE_EVENT, syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncSession);
    };
  }, []);

  return session;
};
