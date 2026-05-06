import { CreditListItem } from "@/features/credits/types/credit.types";
import { PagedResult } from "@/shared/api/types";

type BuildMockCreditsParams = {
  pageNumber: number;
  pageSize: number;
  customerName?: string;
  routeName?: string;
  tag?: string;
  status?: string;
  sort?: string;
  credits?: CreditListItem[];
};

export const mockCreditsSeed: CreditListItem[] = [
  {
    id: "crd-001",
    routeName: "Ruta Centro",
    customerName: "Carlos Beltran",
    creditAmount: { value: 850000 },
    balance: { value: 420000 },
    status: "Active",
    nextDueDate: "2026-05-05T00:00:00.000Z",
    tagIds: ["VIP", "Renovacion"]
  },
  {
    id: "crd-002",
    routeName: "Ruta Norte",
    customerName: "Daniela Suarez",
    creditAmount: { value: 1200000 },
    balance: { value: 1200000 },
    status: "Pending",
    nextDueDate: "2026-05-07T00:00:00.000Z",
    tagIds: ["Nuevo"]
  },
  {
    id: "crd-003",
    routeName: "Ruta Sur",
    customerName: "Miguel Arango",
    creditAmount: { value: 640000 },
    balance: { value: 185000 },
    status: "Active",
    nextDueDate: "2026-05-04T00:00:00.000Z",
    tagIds: ["Frecuente"]
  },
  {
    id: "crd-004",
    routeName: "Ruta Oriental",
    customerName: "Laura Pineda",
    creditAmount: { value: 980000 },
    balance: { value: 0 },
    status: "Paid",
    nextDueDate: "2026-04-28T00:00:00.000Z",
    tagIds: ["Finalizado"]
  },
  {
    id: "crd-005",
    routeName: "Ruta Centro",
    customerName: "Jhon Becerra",
    creditAmount: { value: 730000 },
    balance: { value: 515000 },
    status: "Active",
    nextDueDate: "2026-05-06T00:00:00.000Z",
    tagIds: ["VIP"]
  },
  {
    id: "crd-006",
    routeName: "Ruta Norte",
    customerName: "Paola Herrera",
    creditAmount: { value: 560000 },
    balance: { value: 560000 },
    status: "Pending",
    nextDueDate: "2026-05-10T00:00:00.000Z",
    tagIds: ["Nuevo", "Campana"]
  },
  {
    id: "crd-007",
    routeName: "Ruta Occidente",
    customerName: "Andres Mendez",
    creditAmount: { value: 1500000 },
    balance: { value: 880000 },
    status: "Active",
    nextDueDate: "2026-05-08T00:00:00.000Z",
    tagIds: ["Frecuente", "Ruta premium"]
  },
  {
    id: "crd-008",
    routeName: "Ruta Sur",
    customerName: "Sofia Cardona",
    creditAmount: { value: 430000 },
    balance: { value: 0 },
    status: "Paid",
    nextDueDate: "2026-04-25T00:00:00.000Z",
    tagIds: ["Finalizado"]
  },
  {
    id: "crd-009",
    routeName: "Ruta Oriental",
    customerName: "Yulieth Rojas",
    creditAmount: { value: 910000 },
    balance: { value: 910000 },
    status: "Pending",
    nextDueDate: "2026-05-09T00:00:00.000Z",
    tagIds: ["Nuevo", "Verificado"]
  },
  {
    id: "crd-010",
    routeName: "Ruta Occidente",
    customerName: "Felipe Castro",
    creditAmount: { value: 1100000 },
    balance: { value: 240000 },
    status: "Active",
    nextDueDate: "2026-05-05T00:00:00.000Z",
    tagIds: ["Renovacion"]
  }
];

export function findMockCreditById(
  creditId: string | null,
  credits: CreditListItem[] = mockCreditsSeed
): CreditListItem | null {
  if (!creditId) {
    return null;
  }

  return credits.find((credit) => credit.id === creditId) ?? null;
}

export function buildMockCreditsResponse({
  pageNumber,
  pageSize,
  customerName,
  routeName,
  tag,
  status,
  sort,
  credits = mockCreditsSeed
}: BuildMockCreditsParams): PagedResult<CreditListItem> {
  const normalizedStatus = status?.trim();
  const normalizedCustomerName = customerName?.trim().toLocaleLowerCase("es-CO") ?? "";
  const normalizedRouteName = routeName?.trim().toLocaleLowerCase("es-CO") ?? "";
  const normalizedTag = tag?.trim().toLocaleLowerCase("es-CO") ?? "";
  const filteredCredits = credits.filter((credit) => {
    const matchesStatus = normalizedStatus ? credit.status === normalizedStatus : true;
    const matchesCustomerName = normalizedCustomerName
      ? credit.customerName.toLocaleLowerCase("es-CO").includes(normalizedCustomerName)
      : true;
    const matchesRouteName = normalizedRouteName
      ? credit.routeName.toLocaleLowerCase("es-CO").includes(normalizedRouteName)
      : true;
    const matchesTag = normalizedTag
      ? (credit.tagIds ?? []).some((item) =>
          item.toLocaleLowerCase("es-CO").includes(normalizedTag)
        )
      : true;

    return matchesStatus && matchesCustomerName && matchesRouteName && matchesTag;
  });
  const sortedCredits = [...filteredCredits].sort((left, right) => {
    switch (sort) {
      case "customerName":
        return left.customerName.localeCompare(right.customerName, "es");
      case "nextDueDate":
        return new Date(left.nextDueDate).getTime() - new Date(right.nextDueDate).getTime();
      case "-balance":
        return right.balance.value - left.balance.value;
      case "-nextDueDate":
      default:
        return new Date(right.nextDueDate).getTime() - new Date(left.nextDueDate).getTime();
    }
  });
  const totalCount = sortedCredits.length;
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
  const normalizedPageNumber = Math.min(Math.max(1, pageNumber), totalPages);
  const startIndex = (normalizedPageNumber - 1) * safePageSize;
  const items = sortedCredits.slice(startIndex, startIndex + safePageSize);

  return {
    items,
    totalCount,
    pageNumber: normalizedPageNumber,
    pageSize: safePageSize,
    totalPages,
    hasNextPage: normalizedPageNumber < totalPages,
    hasPreviousPage: normalizedPageNumber > 1
  };
}
