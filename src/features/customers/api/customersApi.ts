import {
  CreateCustomerPayload,
  CustomerDetail,
  CustomerListFilters,
  CustomersListResponse,
  PatchChange
} from "@/features/customers/types/customer.types";
import { request } from "@/shared/api/httpClient";

type CustomerRequestContext = {
  token: string;
  companyId: string | null;
  companyCode: string | null;
};

type GetCustomersParams = CustomerRequestContext & {
  filters: CustomerListFilters;
};

export function getCustomers({
  token,
  companyId,
  companyCode,
  filters
}: GetCustomersParams): Promise<CustomersListResponse> {
  return request<CustomersListResponse>("/customers", {
    method: "GET",
    token,
    companyId,
    companyCode,
    query: {
      PageNumber: filters.pageNumber,
      PageSize: filters.pageSize,
      FullName: filters.fullName,
      DocumentNumber: filters.documentNumber,
      Gender: filters.gender,
      City: filters.city,
      State: filters.state,
      IsActive: filters.isActive,
      sort: filters.sort
    }
  });
}

export function getCustomerById(
  customerId: string,
  context: CustomerRequestContext
): Promise<CustomerDetail> {
  return request<CustomerDetail>(`/customers/${customerId}`, {
    method: "GET",
    token: context.token,
    companyId: context.companyId,
    companyCode: context.companyCode
  });
}

export function createCustomer(
  payload: CreateCustomerPayload,
  context: CustomerRequestContext
): Promise<void> {
  return request<void>("/customers", {
    method: "POST",
    body: payload,
    token: context.token,
    companyId: context.companyId,
    companyCode: context.companyCode
  });
}

export function updateCustomer(
  customerId: string,
  changes: PatchChange[],
  context: CustomerRequestContext
): Promise<void> {
  return request<void>(`/customers/${customerId}`, {
    method: "PATCH",
    body: changes,
    token: context.token,
    companyId: context.companyId,
    companyCode: context.companyCode
  });
}

export function deleteCustomer(
  customerId: string,
  context: CustomerRequestContext
): Promise<void> {
  return request<void>(`/customers/${customerId}`, {
    method: "DELETE",
    token: context.token,
    companyId: context.companyId,
    companyCode: context.companyCode
  });
}
