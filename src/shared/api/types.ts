export type PagedResult<TItem> = {
  items: TItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PatchChange<TValue = unknown> = {
  property: string;
  value: TValue;
};
