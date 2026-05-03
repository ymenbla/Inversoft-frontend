import { AuthTokensResponse, LoginRequest, MeResponse } from "@/features/auth/types/auth.types";
import { request } from "@/shared/api/httpClient";

export function login(payload: LoginRequest): Promise<AuthTokensResponse> {
  return request<AuthTokensResponse>("/auth/login", {
    method: "POST",
    body: payload
  });
}

export function getMe(token: string): Promise<MeResponse> {
  return request<MeResponse>("/auth/me", {
    method: "GET",
    token
  });
}
