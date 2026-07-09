"use client";

export type AuthAccountType = "company" | "customer";
export type AuthUserRole = "MASTER_ADMIN" | "VIEWER";

export type AuthSession = {
  accountType: AuthAccountType;
  role: AuthUserRole;
  userId: string;
  displayName: string;
  customerDocument?: string;
};

const AUTH_STORAGE_KEY = "ovgs-auth-session";

export const companySession: AuthSession = {
  accountType: "company",
  role: "MASTER_ADMIN",
  userId: "demo-master-admin",
  displayName: "OVGS Operação"
};

export const createCustomerSession = (customer: { name: string; document: string }): AuthSession => {
  return {
    accountType: "customer",
    role: "VIEWER",
    userId: customer.document,
    displayName: customer.name,
    customerDocument: customer.document
  };
};

export const isCompanySession = (session: AuthSession | null) => {
  return session?.accountType === "company";
};

export const isCustomerSession = (session: AuthSession | null) => {
  return session?.accountType === "customer";
};

export const getStoredAuthSession = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return parseAuthSession(JSON.parse(storedSession));
  } catch {
    clearStoredAuthSession();
    return null;
  }
};

export const storeAuthSession = (session: AuthSession) => {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredAuthSession = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

const parseAuthSession = (value: unknown): AuthSession | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const session = value as Partial<AuthSession>;

  if (
    (session.accountType !== "company" && session.accountType !== "customer") ||
    (session.role !== "MASTER_ADMIN" && session.role !== "VIEWER") ||
    typeof session.userId !== "string" ||
    typeof session.displayName !== "string"
  ) {
    return null;
  }

  return {
    accountType: session.accountType,
    role: session.role,
    userId: session.userId,
    displayName: session.displayName,
    customerDocument:
      typeof session.customerDocument === "string" ? session.customerDocument : undefined
  };
};
