"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  AuthSession,
  clearStoredAuthSession,
  getStoredAuthSession,
  storeAuthSession
} from "./session";

type AuthContextValue = {
  isReady: boolean;
  session: AuthSession | null;
  login: (session: AuthSession) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(getStoredAuthSession());
    setIsReady(true);
  }, []);

  const login = useCallback(
    (nextSession: AuthSession) => {
      storeAuthSession(nextSession);
      queryClient.clear();
      setSession(nextSession);
    },
    [queryClient]
  );

  const logout = useCallback(() => {
    clearStoredAuthSession();
    queryClient.clear();
    setSession(null);
  }, [queryClient]);

  const value = useMemo(
    () => ({
      isReady,
      session,
      login,
      logout
    }),
    [isReady, login, logout, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
