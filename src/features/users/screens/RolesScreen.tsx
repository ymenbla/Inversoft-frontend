import { ProtectedContent } from "@/shared/ui/auth/ProtectedContent";
import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { Screen } from "@/shared/ui/layout/Screen";

export function RolesScreen(): React.JSX.Element {
  return (
    <Screen
      title="Roles"
      subtitle="Vista de permisos para administrador, supervisor y colaborador."
    >
      <ProtectedContent access="admin">
        <EmptyState
          title="Matriz de permisos"
          description="Aqui podremos hacer visible la politica de acceso y preparar futuras reglas por feature."
        />
      </ProtectedContent>
    </Screen>
  );
}
