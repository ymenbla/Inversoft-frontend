import { ProtectedContent } from "@/shared/ui/auth/ProtectedContent";
import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { Screen } from "@/shared/ui/layout/Screen";

export function PartnersScreen(): React.JSX.Element {
  return (
    <Screen
      title="Socios"
      subtitle="Control de socios involucrados en originacion o seguimiento comercial."
    >
      <ProtectedContent access="admin">
        <EmptyState
          title="Socios del negocio"
          description="Aqui construiremos el listado, filtros y detalle de socios vinculados a las rutas."
        />
      </ProtectedContent>
    </Screen>
  );
}
