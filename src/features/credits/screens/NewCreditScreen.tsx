import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useCustomersQuery } from "@/features/customers/hooks/useCustomersQuery";
import { CustomerListItem } from "@/features/customers/types/customer.types";
import { NewCreditFormCard } from "@/features/credits/components/NewCreditFormCard";
import { SelectionListCard } from "@/features/credits/components/SelectionListCard";
import { useActiveCustomerCreditsQuery } from "@/features/credits/hooks/useActiveCustomerCreditsQuery";
import { useRoutesQuery } from "@/features/routes/hooks/useRoutesQuery";
import { RouteListItem } from "@/features/routes/types/route.types";
import { colors } from "@/shared/theme/colors";
import { Screen } from "@/shared/ui/layout/Screen";
import { spacing } from "@/shared/theme/spacing";
import { typography } from "@/shared/theme/typography";

export function NewCreditScreen(): React.JSX.Element {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState("");

  const customersQuery = useCustomersQuery({
    pageNumber: 1,
    pageSize: 20,
    fullName: "",
    documentNumber: "",
    isActive: true,
    sort: "fullName"
  });

  const routesQuery = useRoutesQuery({
    pageNumber: 1,
    pageSize: 20,
    name: "",
    isActive: true,
    sort: "name"
  });

  const selectedCustomer = useMemo<CustomerListItem | null>(
    () => customersQuery.data?.items.find((item) => item.id === selectedCustomerId) ?? null,
    [customersQuery.data?.items, selectedCustomerId]
  );

  const selectedRoute = useMemo<RouteListItem | null>(
    () => routesQuery.data?.items.find((item) => item.id === selectedRouteId) ?? null,
    [routesQuery.data?.items, selectedRouteId]
  );

  const activeCreditQuery = useActiveCustomerCreditsQuery(selectedCustomer?.fullName ?? null);
  const activeCredits = activeCreditQuery.data?.items ?? [];
  const hasActiveCredit = activeCredits.length > 0;

  return (
    <Screen
      title="Nuevo credito"
      subtitle="Selecciona cliente y ruta, valida la cartera activa y registra un nuevo credito."
    >
      <View style={styles.metrics}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Clientes activos</Text>
          <Text style={styles.metricValue}>{customersQuery.data?.totalCount ?? 0}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Rutas activas</Text>
          <Text style={styles.metricValue}>{routesQuery.data?.totalCount ?? 0}</Text>
        </View>
      </View>

      <SelectionListCard
        title="Selecciona un cliente"
        description="Mostramos clientes activos. La validacion preventiva consulta si ese nombre ya aparece con cartera activa."
        selectedId={selectedCustomerId}
        onSelect={setSelectedCustomerId}
        emptyMessage={
          customersQuery.isLoading
            ? "Cargando clientes..."
            : "No hay clientes activos disponibles."
        }
        items={(customersQuery.data?.items ?? []).map((customer) => ({
          id: customer.id,
          title: customer.fullName,
          subtitle: customer.isMissingReported ? "Con reporte de extravio" : "Disponible"
        }))}
      />

      {selectedCustomer ? (
        <View style={styles.validationCard}>
          <Text style={styles.validationTitle}>Validacion de cartera</Text>

          {activeCreditQuery.isLoading ? (
            <Text style={styles.validationText}>
              Revisando creditos activos del cliente...
            </Text>
          ) : hasActiveCredit ? (
            <>
              <Text style={styles.validationWarning}>
                Se encontro al menos un credito activo para este cliente.
              </Text>
              {activeCredits.map((credit) => (
                <Text key={credit.id} style={styles.validationText}>
                  {credit.routeName} | saldo ${credit.balance.value} | vence{" "}
                  {new Date(credit.nextDueDate).toLocaleDateString("es-CO")}
                </Text>
              ))}
            </>
          ) : activeCreditQuery.isError ? (
            <Text style={styles.validationText}>
              No fue posible verificar la cartera activa de este cliente. La
              validacion final quedara en backend.
            </Text>
          ) : (
            <Text style={styles.validationSuccess}>
              No se detectaron creditos activos para este cliente con la consulta
              preventiva actual.
            </Text>
          )}
        </View>
      ) : null}

      <SelectionListCard
        title="Selecciona una ruta"
        description="La ruta define el flujo operativo del cobro y debe estar activa."
        selectedId={selectedRouteId}
        onSelect={setSelectedRouteId}
        emptyMessage={
          routesQuery.isLoading
            ? "Cargando rutas..."
            : "No hay rutas activas disponibles."
        }
        items={(routesQuery.data?.items ?? []).map((route) => ({
          id: route.id,
          title: route.name,
          subtitle: `Cobrador ${route.collectorName} | Supervisor ${route.supervisorName}`
        }))}
      />

      <NewCreditFormCard
        selectedCustomer={selectedCustomer}
        selectedRoute={selectedRoute}
        hasActiveCredit={hasActiveCredit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  metricCard: {
    flex: 1,
    minWidth: 145,
    padding: spacing.lg,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "800"
  },
  validationCard: {
    padding: spacing.lg,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm
  },
  validationTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "800"
  },
  validationText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22
  },
  validationWarning: {
    color: colors.alert,
    fontSize: typography.body,
    fontWeight: "700"
  },
  validationSuccess: {
    color: colors.success,
    fontSize: typography.body,
    fontWeight: "700"
  }
});
