import { startTransition } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CustomerListItem } from "@/features/customers/types/customer.types";
import { useCreateCreditForm } from "@/features/credits/hooks/useCreateCreditForm";
import { RouteListItem } from "@/features/routes/types/route.types";
import { colors, radius, spacing, typography } from "@/shared/theme";
import { PrimaryButton } from "@/shared/ui/buttons/PrimaryButton";
import { TextField } from "@/shared/ui/inputs/TextField";

type NewCreditFormCardProps = {
  selectedCustomer: CustomerListItem | null;
  selectedRoute: RouteListItem | null;
  hasActiveCredit: boolean;
};

function getFirstError(field: {
  state: { meta: { isTouched: boolean; errors: unknown[] } };
}): string | undefined {
  return field.state.meta.isTouched && field.state.meta.errors.length > 0
    ? String(field.state.meta.errors[0])
    : undefined;
}

export function NewCreditFormCard({
  selectedCustomer,
  selectedRoute,
  hasActiveCredit
}: NewCreditFormCardProps): React.JSX.Element {
  const { form, submitCreditMutation } = useCreateCreditForm({
    onSuccess: () => {
      form.reset();
    }
  });

  const isBlocked = !selectedCustomer || !selectedRoute || hasActiveCredit;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Crear credito</Text>
      <Text style={styles.description}>
        Define monto, tasa, periodicidad y plazo. El cliente y la ruta se toman de las selecciones superiores.
      </Text>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Cliente: {selectedCustomer ? selectedCustomer.fullName : "Sin seleccionar"}
        </Text>
        <Text style={styles.summaryText}>
          Ruta: {selectedRoute ? selectedRoute.name : "Sin seleccionar"}
        </Text>
      </View>

      <form.Field name="creditAmount" validators={{ onChange: ({ value }) => (value.trim() ? undefined : "El monto es obligatorio.") }}>
        {(field) => (
          <TextField
            keyboardType="decimal-pad"
            label="Monto del credito"
            placeholder="Ej: 500000"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFirstError(field)}
          />
        )}
      </form.Field>

      <form.Field name="interestRate" validators={{ onChange: ({ value }) => (value.trim() ? undefined : "La tasa es obligatoria.") }}>
        {(field) => (
          <TextField
            keyboardType="decimal-pad"
            label="Tasa de interes"
            placeholder="Ej: 0.2"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFirstError(field)}
          />
        )}
      </form.Field>

      <form.Field name="periodicityDays" validators={{ onChange: ({ value }) => (value.trim() ? undefined : "La periodicidad es obligatoria.") }}>
        {(field) => (
          <TextField
            keyboardType="numeric"
            label="Periodicidad en dias"
            placeholder="1, 7 o 30"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={(value) => field.handleChange(value.replace(/[^0-9]/g, ""))}
            error={getFirstError(field)}
          />
        )}
      </form.Field>

      <form.Field name="term" validators={{ onChange: ({ value }) => (value.trim() ? undefined : "El plazo es obligatorio.") }}>
        {(field) => (
          <TextField
            keyboardType="numeric"
            label="Plazo"
            placeholder="Numero de cuotas"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={(value) => field.handleChange(value.replace(/[^0-9]/g, ""))}
            error={getFirstError(field)}
          />
        )}
      </form.Field>

      <form.Field name="startDate" validators={{ onChange: ({ value }) => (value.trim() ? undefined : "La fecha inicial es obligatoria.") }}>
        {(field) => (
          <TextField
            label="Fecha de inicio"
            placeholder="YYYY-MM-DD"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFirstError(field)}
          />
        )}
      </form.Field>

      {hasActiveCredit ? (
        <Text style={styles.warningText}>
          El cliente seleccionado ya aparece con un credito activo. No se permitira crear otro desde esta pantalla.
        </Text>
      ) : null}

      {submitCreditMutation.isError ? (
        <Text style={styles.errorText}>
          No fue posible crear el credito. Verifica los datos o revisa la regla de negocio en backend.
        </Text>
      ) : null}

      {submitCreditMutation.isSuccess ? (
        <Text style={styles.successText}>Credito creado correctamente.</Text>
      ) : null}

      <PrimaryButton
        label="Guardar credito"
        disabled={isBlocked}
        isLoading={submitCreditMutation.isPending}
        onPress={() => {
          startTransition(() => {
            form.setFieldValue("customerId", selectedCustomer?.id ?? "");
            form.setFieldValue("routeId", selectedRoute?.id ?? "");
          });
          form.handleSubmit();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "800"
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22
  },
  summary: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.xs
  },
  summaryText: {
    color: colors.text,
    fontSize: typography.body
  },
  warningText: {
    color: colors.alert,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption
  },
  successText: {
    color: colors.success,
    fontSize: typography.caption,
    fontWeight: "700"
  }
});
