import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { Screen } from "@/shared/ui/layout/Screen";

export function RoutesScreen(): React.JSX.Element {
  return (
    <Screen
      title="Rutas"
      subtitle="Gestion de rutas, asignacion de cobradores y supervision."
    >
      <EmptyState
        title="Rutas operativas"
        description="Este espacio mostrara rutas asignadas, cobertura diaria y vinculacion con socios, clientes y cobradores."
      />
    </Screen>
  );
}
