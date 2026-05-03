import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/features/auth/context/SessionContext";
import { getCredits } from "@/features/credits/api/creditsApi";

export function useActiveCustomerCreditsQuery(customerName: string | null) {
  const { profile } = useSession();

  return useQuery({
    queryKey: ["customer-active-credits", profile?.companyId, customerName],
    queryFn: async () => {
      if (!profile?.token || !customerName) {
        throw new Error("No hay contexto para consultar cartera activa.");
      }

      return getCredits(
        {
          pageNumber: 1,
          pageSize: 20,
          customerName,
          status: "Active",
          sort: "-nextDueDate"
        },
        {
          token: profile.token,
          companyId: profile.companyId,
          companyCode: profile.companyCode
        }
      );
    },
    enabled: Boolean(profile?.token && customerName)
  });
}
