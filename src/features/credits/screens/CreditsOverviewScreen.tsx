import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { Screen } from "@/shared/ui/layout/Screen";

export function CreditsOverviewScreen(): React.JSX.Element {
  return (
    <Screen
      title="Cartera general"
      subtitle="Vista consolidada de los creditos de la empresa o del usuario segun su rol."
    >
      <EmptyState
        title="Resumen de cartera"
        description="Aqui conectaremos filtros por estado, cliente, cobrador, supervisor y proximos vencimientos."
      />
    </Screen>
  );
}
