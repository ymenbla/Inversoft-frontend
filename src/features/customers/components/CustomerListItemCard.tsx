import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { CustomerListItem } from "@/features/customers/types/customer.types";
import { colors } from "@/shared/theme/colors";
import { radius } from "@/shared/theme/radius";
import { spacing } from "@/shared/theme/spacing";
import { fontWeights, typography } from "@/shared/theme/typography";

type CustomerListItemCardProps = {
  customer: CustomerListItem;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  isActionsVisible?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => void;
};

export function CustomerListItemCard({
  customer,
  onPress,
  onLongPress,
  isSelected = false,
  isActionsVisible = false,
  onView,
  onEdit,
  onDelete,
  onToggleActive
}: CustomerListItemCardProps): React.JSX.Element {
  const initials = customer.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
  const locationLabel = [customer.city, customer.state].filter(Boolean).join(", ");
  const subtitle = customer.documentNumber
    ? `CC ${customer.documentNumber.toLocaleString("es-CO")}`
    : "Cliente registrado";
  const reportLabel = customer.isMissingReported
    ? "Reportado como extraviado"
    : "Sin reporte de extravio";

  return (
    <Pressable
      delayLongPress={220}
      onLongPress={onLongPress}
      onPress={onPress}
      style={[styles.card, isSelected ? styles.cardSelected : null]}
    >
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || "CL"}</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.header}>
            <View style={styles.titleBlock}>
              <Text numberOfLines={1} style={styles.name}>{customer.fullName}</Text>
              <Text style={styles.idText}>{subtitle}</Text>
            </View>

            <View style={[styles.badge, customer.isActive ? styles.badgeSuccess : styles.badgeMuted]}>
              <Text style={[styles.badgeText, customer.isActive ? styles.badgeTextSuccess : null]}>
                {customer.isActive ? "Activo" : "Inactivo"}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Ionicons color={colors.textMuted} name="location-outline" size={16} />
            <Text numberOfLines={1} style={styles.metaLabel}>
              {locationLabel || "Ubicacion pendiente"}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons color={colors.textMuted} name="alert-circle-outline" size={16} />
            <Text numberOfLines={1} style={styles.metaLabel}>
              {reportLabel}
            </Text>
          </View>
        </View>

        <Ionicons
          color={isSelected ? colors.primary : colors.textMuted}
          name="chevron-forward"
          size={18}
        />
      </View>

      {isActionsVisible ? (
        <View style={styles.actionsRow}>
          <Pressable onPress={onView} style={styles.actionButton}>
            <Text style={styles.actionLabel}>Ver</Text>
          </Pressable>
          <Pressable onPress={onEdit} style={styles.actionButton}>
            <Text style={styles.actionLabel}>Editar</Text>
          </Pressable>
          <Pressable onPress={onDelete} style={[styles.actionButton, styles.actionButtonDanger]}>
            <Text style={[styles.actionLabel, styles.actionLabelDanger]}>Eliminar</Text>
          </Pressable>
          <Pressable onPress={onToggleActive} style={styles.actionButton}>
            <Text style={styles.actionLabel}>
              {customer.isActive ? "Inactivar" : "Activar"}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#F7FAFF"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft
  },
  avatarText: {
    color: colors.primaryStrong,
    fontSize: typography.body,
    ...fontWeights.extrabold
  },
  mainContent: {
    flex: 1,
    gap: spacing.sm
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  titleBlock: {
    flex: 1,
    gap: 2
  },
  name: {
    color: colors.text,
    fontSize: 17,
    ...fontWeights.extrabold
  },
  idText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.regular
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill
  },
  badgeSuccess: {
    backgroundColor: "#E7F8F0"
  },
  badgeMuted: {
    backgroundColor: colors.surfaceMuted
  },
  badgeText: {
    fontSize: typography.caption,
    ...fontWeights.extrabold,
    color: colors.textMuted
  },
  badgeTextSuccess: {
    color: colors.success
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: typography.body,
    ...fontWeights.regular,
    flex: 1
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
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
    ...fontWeights.bold
  },
  actionLabelDanger: {
    color: colors.danger
  }
});
