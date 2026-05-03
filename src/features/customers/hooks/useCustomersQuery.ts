import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getCustomers } from "@/features/customers/api/customersApi";
import { CustomerListFilters } from "@/features/customers/types/customer.types";
import { useSession } from "@/features/auth/context/SessionContext";

type UseCustomersQueryOptions = {
  enabled?: boolean;
};

export function useCustomersQuery(
  filters: CustomerListFilters,
  options: UseCustomersQueryOptions = {}
) {
  const { profile } = useSession();

  return useQuery({
    queryKey: ["customers", profile?.companyId, filters],
    queryFn: async () => {
      if (!profile?.token) {
        throw new Error("No hay una sesion activa para consultar clientes.");
      }

      return getCustomers({
        token: profile.token,
        companyId: profile.companyId,
        companyCode: profile.companyCode,
        filters
      });
    },
    enabled: Boolean(profile?.token) && (options.enabled ?? true),
    placeholderData: keepPreviousData
  });
}
