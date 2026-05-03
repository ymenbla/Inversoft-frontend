import {
  CreateCreditPayload,
  CreditsFilter,
  CreditsListResponse
} from "@/features/credits/types/credit.types";
import { request } from "@/shared/api/httpClient";

type CreditsRequestContext = {
  token: string;
  companyId: string | null;
  companyCode: string | null;
};

export function getCredits(
  filters: CreditsFilter,
  context: CreditsRequestContext
): Promise<CreditsListResponse> {
  return request<CreditsListResponse>("/credits", {
    method: "GET",
    token: context.token,
    companyId: context.companyId,
    companyCode: context.companyCode,
    query: {
      PageNumber: filters.pageNumber,
      PageSize: filters.pageSize,
      CustomerName: filters.customerName,
      Status: filters.status,
      sort: filters.sort
    }
  });
}

export function createCredit(
  payload: CreateCreditPayload,
  context: CreditsRequestContext
): Promise<void> {
  return request<void>("/credits", {
    method: "POST",
    body: payload,
    token: context.token,
    companyId: context.companyId,
    companyCode: context.companyCode
  });
}
