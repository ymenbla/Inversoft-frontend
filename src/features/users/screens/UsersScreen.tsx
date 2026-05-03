import { ProtectedContent } from "@/shared/ui/auth/ProtectedContent";
import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { Screen } from "@/shared/ui/layout/Screen";

export function UsersScreen(): React.JSX.Element {
  return (
    <Screen
      title="Usuarios"
      subtitle="Control administrativo de cuentas, acceso y contexto multi-tenant."
    >
      <ProtectedContent access="admin">
        <EmptyState
          title="Gestion de usuarios"
          description="Este modulo soportara creacion, activacion y organizacion de usuarios por empresa."
        />
      </ProtectedContent>
    </Screen>
  );
}
