import { PagedResult } from "@/shared/api/types";

export type RouteListItem = {
  id: string;
  name: string;
  collectorName: string;
  supervisorName: string;
  isActive: boolean;
};

export type RoutesListResponse = PagedResult<RouteListItem>;

export type RouteListFilters = {
  pageNumber: number;
  pageSize: number;
  name: string;
  isActive?: boolean;
  sort?: string;
};
