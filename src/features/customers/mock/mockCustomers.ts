import {
  CustomerDetail,
  CustomerListFilters,
  CustomersListResponse
} from "@/features/customers/types/customer.types";

export const mockCustomerDetailsSeed: CustomerDetail[] = [
  {
    id: "cst-001",
    documentNumber: 1043001001,
    fullName: "Mariana Torres",
    gender: "Femenino",
    phoneNumber: "3001234501",
    email: "mariana.torres@example.com",
    isActive: true,
    isMissingReported: false,
    missingReportedAt: null,
    locationId: "loc-001",
    location: {
      address: "Cra 45 #72-18",
      city: "Barranquilla",
      state: "Atl\u00e1ntico",
      country: "CO",
      postalCode: "080001",
      latitude: 10.9878,
      longitude: -74.7889
    },
    tags: []
  },
  {
    id: "cst-002",
    documentNumber: 1143102002,
    fullName: "Luis Mendoza",
    gender: "Masculino",
    phoneNumber: "3015550202",
    email: "luis.mendoza@example.com",
    isActive: true,
    isMissingReported: false,
    missingReportedAt: null,
    locationId: "loc-002",
    location: {
      address: "Cll 30 #15-40",
      city: "Soledad",
      state: "Atl\u00e1ntico",
      country: "CO",
      postalCode: "083001",
      latitude: 10.9184,
      longitude: -74.7646
    },
    tags: []
  },
  {
    id: "cst-003",
    documentNumber: 1098703003,
    fullName: "Angela Pineda",
    gender: "Femenino",
    phoneNumber: "3154440303",
    email: "angela.pineda@example.com",
    isActive: false,
    isMissingReported: true,
    missingReportedAt: "2026-04-20T14:00:00Z",
    locationId: "loc-003",
    location: {
      address: "Mz 8 Casa 12",
      city: "Malambo",
      state: "Atl\u00e1ntico",
      country: "CO",
      postalCode: "083009",
      latitude: 10.8594,
      longitude: -74.7736
    },
    tags: []
  },
  {
    id: "cst-004",
    documentNumber: 1122334004,
    fullName: "Carlos Becerra",
    gender: "Masculino",
    phoneNumber: "3021110404",
    email: null,
    isActive: true,
    isMissingReported: false,
    missingReportedAt: null,
    locationId: "loc-004",
    location: {
      address: "Cra 7 #19-55",
      city: "Cartagena",
      state: "Bol\u00edvar",
      country: "CO",
      postalCode: "130001",
      latitude: 10.391,
      longitude: -75.4794
    },
    tags: []
  },
  {
    id: "cst-005",
    documentNumber: 1176545005,
    fullName: "Paola Rico",
    gender: "Femenino",
    phoneNumber: "3207770505",
    email: "paola.rico@example.com",
    isActive: true,
    isMissingReported: false,
    missingReportedAt: null,
    locationId: "loc-005",
    location: {
      address: "Cll 8 #22-60",
      city: "Santa Marta",
      state: "Magdalena",
      country: "CO",
      postalCode: "470004",
      latitude: 11.2408,
      longitude: -74.199
    },
    tags: []
  },
  {
    id: "cst-006",
    documentNumber: 1010106006,
    fullName: "Jorge Villalba",
    gender: "Masculino",
    phoneNumber: "3049990606",
    email: "jorge.villalba@example.com",
    isActive: false,
    isMissingReported: false,
    missingReportedAt: null,
    locationId: "loc-006",
    location: {
      address: "Cra 12 #9-14",
      city: "Sincelejo",
      state: "Sucre",
      country: "CO",
      postalCode: "700001",
      latitude: 9.3047,
      longitude: -75.3978
    },
    tags: []
  },
  {
    id: "cst-007",
    documentNumber: 1088807007,
    fullName: "Diana Arango",
    gender: "Femenino",
    phoneNumber: "3176000707",
    email: "diana.arango@example.com",
    isActive: true,
    isMissingReported: false,
    missingReportedAt: null,
    locationId: "loc-007",
    location: {
      address: "Av Murillo #14-20",
      city: "Barranquilla",
      state: "Atl\u00e1ntico",
      country: "CO",
      postalCode: "080020",
      latitude: 10.9685,
      longitude: -74.8012
    },
    tags: []
  },
  {
    id: "cst-008",
    documentNumber: 1066608008,
    fullName: "Mateo Blanco",
    gender: "Masculino",
    phoneNumber: "3008080808",
    email: null,
    isActive: true,
    isMissingReported: true,
    missingReportedAt: "2026-04-11T09:30:00Z",
    locationId: "loc-008",
    location: {
      address: "Cll 40 #27-33",
      city: "Valledupar",
      state: "Cesar",
      country: "CO",
      postalCode: "200001",
      latitude: 10.4631,
      longitude: -73.2532
    },
    tags: []
  },
  {
    id: "cst-009",
    documentNumber: 1055509009,
    fullName: "Sandra Yepes",
    gender: "Femenino",
    phoneNumber: "3059090909",
    email: "sandra.yepes@example.com",
    isActive: true,
    isMissingReported: false,
    missingReportedAt: null,
    locationId: "loc-009",
    location: {
      address: "Cra 20 #33-90",
      city: "Monter\u00eda",
      state: "C\u00f3rdoba",
      country: "CO",
      postalCode: "230002",
      latitude: 8.7479,
      longitude: -75.8814
    },
    tags: []
  },
  {
    id: "cst-010",
    documentNumber: 1033310010,
    fullName: "Andres Romero",
    gender: "Masculino",
    phoneNumber: "3181010101",
    email: "andres.romero@example.com",
    isActive: false,
    isMissingReported: false,
    missingReportedAt: null,
    locationId: "loc-010",
    location: {
      address: "Cra 3 #6-18",
      city: "Riohacha",
      state: "La Guajira",
      country: "CO",
      postalCode: "440001",
      latitude: 11.5444,
      longitude: -72.9072
    },
    tags: []
  }
];

export function buildMockCustomersResponse(
  customers: CustomerDetail[],
  filters: CustomerListFilters
): CustomersListResponse {
  const normalizedName = filters.fullName.trim().toLowerCase();
  const normalizedDocument = filters.documentNumber.trim();
  const normalizedGender = filters.gender?.trim().toLowerCase() ?? "";
  const normalizedCity = filters.city?.trim().toLowerCase() ?? "";
  const normalizedState = filters.state?.trim().toLowerCase() ?? "";

  const filtered = customers.filter((customer) => {
    const matchesName = normalizedName
      ? customer.fullName.toLowerCase().includes(normalizedName)
      : true;
    const matchesDocument = normalizedDocument
      ? String(customer.documentNumber).includes(normalizedDocument)
      : true;
    const matchesGender = normalizedGender
      ? customer.gender.toLowerCase().includes(normalizedGender)
      : true;
    const matchesCity = normalizedCity
      ? customer.location.city.toLowerCase().includes(normalizedCity)
      : true;
    const matchesState = normalizedState
      ? (customer.location.state ?? "").toLowerCase().includes(normalizedState)
      : true;
    const matchesActive =
      filters.isActive === undefined ? true : customer.isActive === filters.isActive;

    return (
      matchesName &&
      matchesDocument &&
      matchesGender &&
      matchesCity &&
      matchesState &&
      matchesActive
    );
  });

  const sorted = [...filtered].sort((left, right) =>
    left.fullName.localeCompare(right.fullName)
  );

  const pageSize = filters.pageSize;
  const pageNumber = filters.pageNumber;
  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePageNumber = Math.min(pageNumber, totalPages);
  const startIndex = (safePageNumber - 1) * pageSize;
  const items = sorted.slice(startIndex, startIndex + pageSize).map((customer) => ({
    id: customer.id,
    fullName: customer.fullName,
    isActive: customer.isActive,
    isMissingReported: customer.isMissingReported,
    documentNumber: customer.documentNumber,
    city: customer.location.city,
    state: customer.location.state
  }));

  return {
    items,
    totalCount,
    pageNumber: safePageNumber,
    pageSize,
    totalPages,
    hasNextPage: safePageNumber < totalPages,
    hasPreviousPage: safePageNumber > 1
  };
}

export function findMockCustomerDetail(
  customers: CustomerDetail[],
  customerId: string | null
): CustomerDetail | undefined {
  if (!customerId) {
    return undefined;
  }

  return customers.find((customer) => customer.id === customerId);
}

export function getMockCustomersResponse(
  filters: CustomerListFilters
): CustomersListResponse {
  return buildMockCustomersResponse(mockCustomerDetailsSeed, filters);
}

export function getMockCustomerDetail(customerId: string | null): CustomerDetail | undefined {
  return findMockCustomerDetail(mockCustomerDetailsSeed, customerId);
}
