import { ProtectedContent } from "@/shared/ui/auth/ProtectedContent";
import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { Screen } from "@/shared/ui/layout/Screen";

export function NotificationsScreen(): React.JSX.Element {
  return (
    <Screen
      title="Notificaciones"
      subtitle="Alertas operativas, novedades y casos de clientes reportados."
    >
      <ProtectedContent access="admin">
        <EmptyState
          title="Centro de alertas"
          description="Este modulo se conectara con las notificaciones del backend y acciones de seguimiento."
        />
      </ProtectedContent>
    </Screen>
  );
}
