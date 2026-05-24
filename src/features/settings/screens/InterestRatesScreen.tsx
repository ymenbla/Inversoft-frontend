import { ProtectedContent } from "@/shared/ui/auth/ProtectedContent";
import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { Screen } from "@/shared/ui/layout/Screen";

export function InterestRatesScreen(): React.JSX.Element {
  return (
    <Screen
      title="Tasas de Interes"
      subtitle="Configuracion base de tasas para originacion, simulacion y reglas comerciales."
    >
      <ProtectedContent access="admin">
        <EmptyState
          title="Tabla de tasas"
          description="Aqui podremos administrar tasas vigentes, historicas y configuraciones por producto o segmento."
        />
      </ProtectedContent>
    </Screen>
  );
}
