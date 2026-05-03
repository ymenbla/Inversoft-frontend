import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/features/auth/context/SessionContext";
import { getRoutes } from "@/features/routes/api/routesApi";
import { RouteListFilters } from "@/features/routes/types/route.types";

export function useRoutesQuery(filters: RouteListFilters) {
  const { profile } = useSession();

  return useQuery({
    queryKey: ["routes", profile?.companyId, filters],
    queryFn: async () => {
      if (!profile?.token) {
        throw new Error("No hay sesion activa para consultar rutas.");
      }

      return getRoutes(filters, {
        token: profile.token,
        companyId: profile.companyId,
        companyCode: profile.companyCode
      });
    },
    enabled: Boolean(profile?.token)
  });
}
