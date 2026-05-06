import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/features/auth/context/SessionContext";
import { getCredits } from "@/features/credits/api/creditsApi";
import { CreditsFilter } from "@/features/credits/types/credit.types";

type UseCreditsQueryOptions = {
  enabled?: boolean;
};

export function useCreditsQuery(
  filters: CreditsFilter,
  options?: UseCreditsQueryOptions
) {
  const { profile } = useSession();

  return useQuery({
    queryKey: ["credits", profile?.companyId, filters],
    queryFn: async () => {
      if (!profile?.token) {
        throw new Error("No hay sesion activa para consultar creditos.");
      }

      return getCredits(filters, {
        token: profile.token,
        companyId: profile.companyId,
        companyCode: profile.companyCode
      });
    },
    enabled: Boolean(profile?.token) && (options?.enabled ?? true)
  });
}
