import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { LocationMapPreview } from "@/features/customers/components/LocationMapPreview";
import { CustomerDetail } from "@/features/customers/types/customer.types";
import { colors } from "@/shared/theme/colors";
import { radius } from "@/shared/theme/radius";
import { spacing } from "@/shared/theme/spacing";
import { fontWeights, typography } from "@/shared/theme/typography";
import { PrimaryButton } from "@/shared/ui/buttons/PrimaryButton";
import { SecondaryButton } from "@/shared/ui/buttons/SecondaryButton";
import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { LoadingBlock } from "@/shared/ui/feedback/LoadingBlock";

type CustomerDetailCardProps = {
  customer: CustomerDetail | undefined;
  isLoading: boolean;
  isError: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  updateErrorMessage?: string | null;
  deleteErrorMessage?: string | null;
  onToggleActive?: () => void;
  onDelete?: () => void;
};

function DetailRow({
  label,
  value,
  iconName
}: {
  label: string;
  value: string;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
}): React.JSX.Element {
  return (
    <View style={styles.detailCard}>
      <View style={styles.detailHeader}>
        {iconName ? <Ionicons color={colors.textMuted} name={iconName} size={15} /> : null}
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function CustomerDetailCard({
  customer,
  isLoading,
  isError,
  isUpdating = false,
  isDeleting = false,
  updateErrorMessage,
  deleteErrorMessage,
  onToggleActive,
  onDelete
}: CustomerDetailCardProps): React.JSX.Element {
  if (isLoading) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Detalle del cliente</Text>
        <LoadingBlock />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Detalle del cliente</Text>
        <EmptyState
          title="No fue posible cargar el detalle"
          description="Intenta seleccionar de nuevo el cliente o revisa la conexion con el backend."
        />
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Detalle del cliente</Text>
        <EmptyState
          title="Selecciona un cliente"
          description="Toca un registro del listado para ver datos de contacto, estado y ubicacion."
        />
      </View>
    );
  }

  const initials = customer.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
  const statusLabel = customer.isActive ? "Activo" : "Inactivo";
  const missingLabel = customer.isMissingReported ? "Extraviado" : "Sin reporte";
  const fullLocation = [
    customer.location.address,
    customer.location.city,
    customer.location.state
  ].filter(Boolean).join(", ");

  return (
    <View style={styles.card}>
      <View style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || "CL"}</Text>
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.name}>{customer.fullName}</Text>
            <Text style={styles.heroSubtitle}>CC {customer.documentNumber.toLocaleString("es-CO")}</Text>
            <Text style={styles.heroLocation}>{fullLocation || "Ubicacion pendiente"}</Text>
          </View>
        </View>

        <View style={styles.chipsRow}>
          <View style={[styles.statusChip, customer.isActive ? styles.statusChipSuccess : styles.statusChipMuted]}>
            <Text style={[styles.statusChipText, customer.isActive ? styles.statusChipTextSuccess : null]}>
              {statusLabel}
            </Text>
          </View>
          <View style={[styles.statusChip, customer.isMissingReported ? styles.statusChipAlert : styles.statusChipMuted]}>
            <Text style={[styles.statusChipText, customer.isMissingReported ? styles.statusChipTextAlert : null]}>
              {missingLabel}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        <View style={styles.detailsGrid}>
          <DetailRow label="Genero" value={customer.gender} iconName="person-outline" />
          <DetailRow label="Telefono" value={customer.phoneNumber} iconName="call-outline" />
          <DetailRow label="Correo" value={customer.email || "Sin correo"} iconName="mail-outline" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ubicacion</Text>
        <View style={styles.detailsGrid}>
          <DetailRow label="Direccion" value={customer.location.address} iconName="navigate-outline" />
          <DetailRow label="Ciudad" value={customer.location.city} iconName="business-outline" />
          <DetailRow label="Departamento" value={customer.location.state || "Sin dato"} iconName="map-outline" />
          <DetailRow label="Pais" value={customer.location.country} iconName="flag-outline" />
        </View>
      </View>

      <LocationMapPreview
        address={customer.location.address}
        city={customer.location.city}
        state={customer.location.state || ""}
        latitude={
          customer.location.latitude !== null && customer.location.latitude !== undefined
            ? String(customer.location.latitude)
            : ""
        }
        longitude={
          customer.location.longitude !== null && customer.location.longitude !== undefined
            ? String(customer.location.longitude)
            : ""
        }
        isInteractive={false}
      />

      {updateErrorMessage ? <Text style={styles.errorText}>{updateErrorMessage}</Text> : null}
      {deleteErrorMessage ? <Text style={styles.errorText}>{deleteErrorMessage}</Text> : null}

      <View style={styles.actions}>
        <SecondaryButton
          label={customer.isActive ? "Desactivar cliente" : "Activar cliente"}
          disabled={isUpdating || isDeleting}
          onPress={() => onToggleActive?.()}
        />
        <PrimaryButton
          label={isDeleting ? "Eliminando..." : "Eliminar cliente"}
          disabled={isUpdating || isDeleting}
          isLoading={isDeleting}
          onPress={() => onDelete?.()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: typography.heading,
    ...fontWeights.extrabold
  },
  heroCard: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  avatar: {
    width: 56,
    height: 56,
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
  heroContent: {
    flex: 1,
    gap: spacing.xs
  },
  name: {
    color: colors.primaryStrong,
    fontSize: 28,
    ...fontWeights.extrabold
  },
  heroSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    ...fontWeights.bold
  },
  heroLocation: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    ...fontWeights.regular
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  statusChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill
  },
  statusChipSuccess: {
    backgroundColor: "#E7F8F0"
  },
  statusChipMuted: {
    backgroundColor: colors.surfaceMuted
  },
  statusChipAlert: {
    backgroundColor: "#FFF1E6"
  },
  statusChipText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.extrabold
  },
  statusChipTextSuccess: {
    color: colors.success
  },
  statusChipTextAlert: {
    color: colors.alert
  },
  section: {
    gap: spacing.md
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.extrabold
  },
  detailsGrid: {
    gap: spacing.md
  },
  detailCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  detailValue: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    ...fontWeights.medium
  },
  actions: {
    gap: spacing.md
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption
  }
});
