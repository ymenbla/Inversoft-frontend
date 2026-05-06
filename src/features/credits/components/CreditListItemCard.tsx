import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { CreditListItem } from "@/features/credits/types/credit.types";
import { colors } from "@/shared/theme/colors";
import { radius } from "@/shared/theme/radius";
import { spacing } from "@/shared/theme/spacing";
import { typography } from "@/shared/theme/typography";

type CreditListItemCardProps = {
  credit: CreditListItem;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  isActionsVisible?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPay?: () => void;
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
    return styles.metricTextActiveBalance;
  }

  if (status === "Paid") {
    return styles.metricTextPaidBalance;
  }

  return styles.metricTextMutedBalance;
}

export function CreditListItemCard({
  credit,
  onPress,
  onLongPress,
  isSelected = false,
  isActionsVisible = false,
  onView,
  onEdit,
  onDelete,
  onPay
}: CreditListItemCardProps): React.JSX.Element {
  return (
    <Pressable
      delayLongPress={220}
      onLongPress={onLongPress}
      onPress={onPress}
      style={[styles.card, isSelected ? styles.cardSelected : null]}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text numberOfLines={1} style={styles.customerName}>{credit.customerName}</Text>
          <View style={styles.metaInlineRow}>
            <Text style={styles.idText}>Credito #{credit.id.slice(-3)}</Text>
            <View style={styles.metaDot} />
            <Text numberOfLines={1} style={styles.routeInlineText}>{credit.routeName}</Text>
          </View>
        </View>

        <View style={[styles.badge, getStatusTone(credit.status)]}>
          <Text style={styles.statusLabel}>{formatStatus(credit.status)}</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricInline}>
          <Text numberOfLines={1} style={styles.metricText}>
            {formatMoney(credit.creditAmount.value)}
          </Text>
          <Text style={styles.metricLabel}>Monto</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricInline}>
          <Text
            numberOfLines={1}
            style={[styles.metricText, getBalanceTone(credit.status)]}
          >
            {getBalanceValue(credit)}
          </Text>
          <Text style={styles.metricLabel}>Saldo</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.footerContent}>
          <Ionicons color={colors.textMuted} name="calendar-outline" size={16} />
          <View style={styles.footerTextBlock}>
            <Text numberOfLines={1} style={styles.footerValue}>
              {new Date(credit.nextDueDate).toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </Text>
            <Text style={styles.footerLabel}>Proximo pago</Text>
          </View>
        </View>
        <View style={styles.chevronButton}>
          <Ionicons color={colors.textMuted} name="chevron-forward" size={18} />
        </View>
      </View>

      {isActionsVisible ? (
        <View style={styles.actionsRow}>
          <Pressable onPress={onView} style={styles.actionButton}>
            <Text style={styles.actionLabel}>Ver</Text>
          </Pressable>
          {onEdit ? (
            <Pressable onPress={onEdit} style={styles.actionButton}>
              <Text style={styles.actionLabel}>Editar</Text>
            </Pressable>
          ) : null}
          {onDelete ? (
            <Pressable onPress={onDelete} style={[styles.actionButton, styles.actionButtonDanger]}>
              <Text style={[styles.actionLabel, styles.actionLabelDanger]}>Eliminar</Text>
            </Pressable>
          ) : null}
          {onPay ? (
            <Pressable onPress={onPay} style={styles.actionButton}>
              <Text style={styles.actionLabel}>Pagar</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    boxShadow: "0px 12px 28px rgba(11, 20, 37, 0.06)"
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#F7FAFF"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  headerText: {
    flex: 1,
    gap: 2
  },
  metaInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  customerName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800"
  },
  idText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "600"
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border
  },
  routeInlineText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "600"
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
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
  statusLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  metricInline: {
    flex: 1,
    gap: 2
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "600"
  },
  metricText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800"
  },
  metricTextActiveBalance: {
    color: colors.primaryStrong
  },
  metricTextPaidBalance: {
    color: colors.textMuted
  },
  metricTextMutedBalance: {
    color: colors.textMuted
  },
  metricDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: colors.border
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  footerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  footerTextBlock: {
    flex: 1,
    gap: 2
  },
  footerLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "600"
  },
  footerValue: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "600"
  },
  chevronButton: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingTop: spacing.xs
  },
  actionButton: {
    minHeight: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted
  },
  actionButtonDanger: {
    borderColor: "#F3C4C4",
    backgroundColor: "#FFF4F4"
  },
  actionLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  actionLabelDanger: {
    color: colors.danger
  }
});
