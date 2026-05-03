import { env } from "@/shared/config/env";

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  companyId?: string | null;
  companyCode?: string | null;
  query?: Record<string, string | number | boolean | null | undefined>;
};

export class ApiError extends Error {
  public readonly status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function request<TResponse>(
  path: string,
  options: RequestOptions = {}
): Promise<TResponse> {
  const { method = "GET", body, token, companyId, companyCode, query } = options;
  const queryString = buildQueryString(query);

  const response = await fetch(`${env.apiBaseUrl}${path}${queryString}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(companyId ? { "X-Company-Id": companyId } : {}),
      ...(companyCode ? { "X-Company-Code": companyCode } : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    const fallbackMessage = "Ocurrio un error al procesar la solicitud.";
    const responseText = await response.text();

    throw new ApiError(responseText || fallbackMessage, response.status);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const responseText = await response.text();

  if (!responseText.trim()) {
    return undefined as TResponse;
  }

  try {
    return JSON.parse(responseText) as TResponse;
  } catch {
    return responseText as TResponse;
  }
}

function buildQueryString(
  query?: Record<string, string | number | boolean | null | undefined>
): string {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}
