import { PagedResult } from "@/shared/api/types";

export type MoneyDto = {
  value: number;
};

export type CreditListItem = {
  id: string;
  customerId?: string;
  routeId?: string;
  routeName: string;
  customerName: string;
  creditAmount: MoneyDto;
  balance: MoneyDto;
  status: "Active" | "Pending" | "Paid" | string;
  nextDueDate: string;
  installmentAmount?: MoneyDto;
  interestRate?: number;
  periodicityDays?: number;
  term?: number;
  startDate?: string;
  tagIds?: string[];
};

export type CreditsListResponse = PagedResult<CreditListItem>;

export type CreditsFilter = {
  pageNumber: number;
  pageSize: number;
  customerName?: string;
  routeName?: string;
  tag?: string;
  status?: string;
  sort?: string;
};

export type CreateCreditPayload = {
  customerId: string;
  routeId: string;
  creditAmount: number;
  installmentAmount: number;
  interestRate: number;
  periodicityDays: number;
  term: number;
  startDate: string;
  tagIds: string[] | null;
};
