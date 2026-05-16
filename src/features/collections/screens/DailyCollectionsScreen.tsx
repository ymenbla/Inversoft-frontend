import { StyleSheet, View } from "react-native";

import { DashboardHeaderActions } from "@/features/dashboard/components/DashboardHeaderActions";
import { MetricCard } from "@/shared/ui/cards/MetricCard";
import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { Screen } from "@/shared/ui/layout/Screen";
import { spacing } from "@/shared/theme";

export function DailyCollectionsScreen(): React.JSX.Element {
  return (
    <Screen
      title="Cobros del dia"
      subtitle="Consulta la cartera pendiente, prioriza atrasos y registra recaudos."
      rightSlot={<DashboardHeaderActions />}
    >
      <View style={styles.metrics}>
        <MetricCard label="Pendientes hoy" value="24" tone="alert" />
        <MetricCard label="Recaudado" value="$ 1.280.000" tone="success" />
      </View>

      <EmptyState
        title="Agenda de cobro lista"
        description="Aqui mostraremos los creditos con vencimiento del dia, atrasos y acceso rapido a registrar pagos."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  }
});
