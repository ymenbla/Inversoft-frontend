import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { Screen } from "@/shared/ui/layout/Screen";

export function PaymentsScreen(): React.JSX.Element {
  return (
    <Screen
      title="Pagos"
      subtitle="Historial de recaudos por fecha, cliente, ruta y medio de pago."
    >
      <EmptyState
        title="Historial de pagos"
        description="Este modulo concentrara filtros, listado paginado y detalle de movimientos de caja."
      />
    </Screen>
  );
}
