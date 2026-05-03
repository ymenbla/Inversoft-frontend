import { PagedResult } from "@/shared/api/types";

export type CustomerListItem = {
  id: string;
  fullName: string;
  isActive: boolean;
  isMissingReported: boolean;
  documentNumber?: number;
  city?: string;
  state?: string | null;
};

export type CustomersListResponse = PagedResult<CustomerListItem>;

export type CustomerListFilters = {
  pageNumber: number;
  pageSize: number;
  fullName: string;
  documentNumber: string;
  gender?: string;
  city?: string;
  state?: string;
  isActive?: boolean;
  sort?: string;
};

export type CustomerTag = {
  id: string;
  name: string;
  isActive: boolean;
};

export type CustomerLocation = {
  address: string;
  city: string;
  state: string | null;
  country: string;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type CustomerDetail = {
  id: string;
  documentNumber: number;
  fullName: string;
  gender: string;
  phoneNumber: string;
  email: string | null;
  isActive: boolean;
  isMissingReported: boolean;
  missingReportedAt: string | null;
  locationId: string;
  location: CustomerLocation;
  tags: CustomerTag[];
};

export type CreateCustomerPayload = {
  documentNumber: number;
  fullName: string;
  gender: string;
  phoneNumber: string;
  email: string | null;
  location: {
    address: string;
    city: string;
    state: string | null;
    postalCode: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;
  };
  tagIds: string[] | null;
};

export type PatchChange = {
  property: string;
  value: unknown;
};
