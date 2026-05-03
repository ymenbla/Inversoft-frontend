import { RouteListFilters, RoutesListResponse } from "@/features/routes/types/route.types";
import { request } from "@/shared/api/httpClient";

type RoutesRequestContext = {
  token: string;
  companyId: string | null;
  companyCode: string | null;
};

export function getRoutes(
  filters: RouteListFilters,
  context: RoutesRequestContext
): Promise<RoutesListResponse> {
  return request<RoutesListResponse>("/routes", {
    method: "GET",
    token: context.token,
    companyId: context.companyId,
    companyCode: context.companyCode,
    query: {
      PageNumber: filters.pageNumber,
      PageSize: filters.pageSize,
      Name: filters.name,
      IsActive: filters.isActive,
      sort: filters.sort
    }
  });
}
