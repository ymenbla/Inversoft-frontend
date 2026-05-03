import { ProtectedContent } from "@/shared/ui/auth/ProtectedContent";
import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { Screen } from "@/shared/ui/layout/Screen";

export function CollaboratorsScreen(): React.JSX.Element {
  return (
    <Screen
      title="Colaboradores"
      subtitle="Administracion de usuarios operativos, supervisores y permisos."
    >
      <ProtectedContent access="admin">
        <EmptyState
          title="Equipo operativo"
          description="Este modulo integrara alta de cobradores, roles de supervision y relacion con rutas."
        />
      </ProtectedContent>
    </Screen>
  );
}
