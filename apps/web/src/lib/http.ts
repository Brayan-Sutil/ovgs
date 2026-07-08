const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
const USER_ROLE = process.env.NEXT_PUBLIC_USER_ROLE ?? "MASTER_ADMIN";
const USER_ID = process.env.NEXT_PUBLIC_USER_ID ?? "demo-master-admin";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export const apiFetch = async <T>(
  path: string,
  options: Omit<RequestInit, "body"> & { body?: BodyInit | object | null } = {}
): Promise<T> => {
  const headers = new Headers(options.headers);
  headers.set("x-user-role", headers.get("x-user-role") ?? USER_ROLE);
  headers.set("x-user-id", headers.get("x-user-id") ?? USER_ID);

  let body = options.body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: body as BodyInit | null | undefined
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message =
      typeof payload?.error === "string"
        ? payload.error
        : payload?.error?.message ?? "Nao foi possivel concluir a operacao";
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
