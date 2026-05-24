import { ProtectedContent } from "@/shared/ui/auth/ProtectedContent";
import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { Screen } from "@/shared/ui/layout/Screen";

export function TagsScreen(): React.JSX.Element {
  return (
    <Screen
      title="Tags"
      subtitle="Configuracion administrativa de etiquetas para clientes, creditos y futuros filtros."
    >
      <ProtectedContent access="admin">
        <EmptyState
          title="Catalogo de tags"
          description="Aqui construiremos la gestion de tags, activacion y uso transversal en clientes y cartera."
        />
      </ProtectedContent>
    </Screen>
  );
}
