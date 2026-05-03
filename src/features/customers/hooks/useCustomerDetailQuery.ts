import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/features/auth/context/SessionContext";
import { getCustomerById } from "@/features/customers/api/customersApi";

type UseCustomerDetailQueryOptions = {
  enabled?: boolean;
};

export function useCustomerDetailQuery(
  customerId: string | null,
  options: UseCustomerDetailQueryOptions = {}
) {
  const { profile } = useSession();

  return useQuery({
    queryKey: ["customer-detail", profile?.companyId, customerId],
    queryFn: async () => {
      if (!profile?.token || !customerId) {
        throw new Error("No hay datos suficientes para cargar el detalle del cliente.");
      }

      return getCustomerById(customerId, {
        token: profile.token,
        companyId: profile.companyId,
        companyCode: profile.companyCode
      });
    },
    enabled: Boolean(profile?.token && customerId) && (options.enabled ?? true)
  });
}
