import { StyleSheet, Text, View } from "react-native";

import { findMockCreditById } from "@/features/credits/mock/mockCredits";
import { CreditListItem } from "@/features/credits/types/credit.types";
import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { PrimaryButton } from "@/shared/ui/buttons/PrimaryButton";
import { colors, componentTokens, fontWeights, radius, shadows, spacing, typography } from "@/shared/theme";

type CreditDetailContentProps = {
  creditId: string | null;
  credit?: CreditListItem | null;
  onCollect?: (credit: CreditListItem) => void;
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);
}

function formatStatus(status: string): string {
  if (status === "Active") {
    return "Activo";
  }

  if (status === "Pending") {
    return "Pendiente";
  }

  if (status === "Paid") {
    return "Pagado";
  }

  return status;
}

function getStatusTone(status: string) {
  if (status === "Active") {
    return styles.statusActive;
  }

  if (status === "Pending") {
    return styles.statusPending;
  }

  if (status === "Paid") {
    return styles.statusPaid;
  }

  return null;
}

function getStatusTextTone(status: string) {
  if (status === "Active") {
    return styles.statusTextActive;
  }

  if (status === "Pending") {
    return styles.statusTextPending;
  }

  if (status === "Paid") {
    return styles.statusTextPaid;
  }

  return null;
}

function getBalanceValue(credit: CreditListItem): string {
  if (credit.status === "Pending") {
    return "-";
  }

  if (credit.status === "Paid") {
    return "0";
  }

  return formatMoney(credit.balance.value);
}

function getBalanceTone(status: string) {
  if (status === "Active") {
    return styles.metricValueActive;
  }

  if (status === "Paid") {
    return styles.metricValuePaid;
  }

  return styles.metricValueMuted;
}

export function CreditDetailContent({
  creditId,
  credit,
  onCollect
}: CreditDetailContentProps): React.JSX.Element {
  const resolvedCredit = credit ?? findMockCreditById(creditId);

  if (!resolvedCredit) {
    return (
      <EmptyState
        title="Credito no disponible"
        description="Este credito no existe en el mock actual o fue removido del listado."
      />
    );
  }

  const canCollect =
    resolvedCredit.status === "Active" && resolvedCredit.balance.value > 0;

  return (
    <View style={styles.content}>
      <View style={styles.headerBlock}>
        <Text style={styles.customerName}>{resolvedCredit.customerName}</Text>
        <Text style={styles.creditMeta}>
          Credito #{resolvedCredit.id.slice(-3)} | {resolvedCredit.routeName}
        </Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroTitle}>Resumen del credito</Text>
          <View style={[styles.statusBadge, getStatusTone(resolvedCredit.status)]}>
            <Text style={[styles.statusText, getStatusTextTone(resolvedCredit.status)]}>
              {formatStatus(resolvedCredit.status)}
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{formatMoney(resolvedCredit.creditAmount.value)}</Text>
            <Text style={styles.metricLabel}>Monto aprobado</Text>
          </View>
          <View style={styles.metricCard}>
            <Text
              style={[styles.metricValue, getBalanceTone(resolvedCredit.status)]}
            >
              {getBalanceValue(resolvedCredit)}
            </Text>
            <Text style={styles.metricLabel}>Saldo pendiente</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.sectionTitle}>Detalle operativo</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ruta</Text>
          <Text style={styles.detailValue}>{resolvedCredit.routeName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Estado</Text>
          <Text style={styles.detailValue}>{formatStatus(resolvedCredit.status)}</Text>
        </View>

        <View style={[styles.detailRow, styles.detailRowLast]}>
          <Text style={styles.detailLabel}>Proximo pago</Text>
          <Text style={styles.detailValue}>
            {new Date(resolvedCredit.nextDueDate).toLocaleDateString("es-CO", {
              day: "2-digit",
              month: "long",
              year: "numeric"
            })}
          </Text>
        </View>
      </View>

      {canCollect && onCollect ? (
        <View style={styles.actionsBlock}>
          <PrimaryButton
            label="Cobrar"
            onPress={() => onCollect(resolvedCredit)}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg
  },
  headerBlock: {
    gap: spacing.xs
  },
  customerName: {
    color: colors.text,
    fontSize: typography.heading,
    ...fontWeights.extrabold
  },
  creditMeta: {
    color: colors.textMuted,
    fontSize: typography.body,
    ...fontWeights.semibold
  },
  heroCard: {
    padding: componentTokens.card.defaultPadding,
    borderRadius: componentTokens.card.radius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadows.raisedCard
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  heroTitle: {
    color: colors.text,
    fontSize: typography.heading,
    ...fontWeights.extrabold
  },
  statusBadge: {
    minHeight: componentTokens.badge.minHeight,
    paddingHorizontal: componentTokens.badge.paddingHorizontal,
    paddingVertical: spacing.xs,
    borderRadius: componentTokens.badge.radius,
    borderWidth: 1
  },
  statusActive: {
    backgroundColor: "#E7F8F0",
    borderColor: "#BEE7D3"
  },
  statusPending: {
    backgroundColor: "#FFF6DB",
    borderColor: "#F7D98A"
  },
  statusPaid: {
    backgroundColor: "#E8F0FF",
    borderColor: "#C4D7FF"
  },
  statusText: {
    fontSize: typography.caption,
    ...fontWeights.extrabold,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  statusTextActive: {
    color: "#157347"
  },
  statusTextPending: {
    color: "#A46A00"
  },
  statusTextPaid: {
    color: colors.primaryStrong
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    padding: componentTokens.card.compactPadding,
    borderRadius: componentTokens.card.compactRadius,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.heading,
    ...fontWeights.extrabold
  },
  metricValueActive: {
    color: colors.primaryStrong
  },
  metricValuePaid: {
    color: colors.textMuted
  },
  metricValueMuted: {
    color: colors.textMuted
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.semibold
  },
  detailCard: {
    padding: componentTokens.card.defaultPadding,
    borderRadius: componentTokens.card.radius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadows.card
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.heading,
    ...fontWeights.extrabold
  },
  detailRow: {
    gap: spacing.xs,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  detailValue: {
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.bold
  },
  actionsBlock: {
    gap: spacing.md
  },
  detailRowLast: {
    paddingBottom: 0,
    borderBottomWidth: 0
  }
});
