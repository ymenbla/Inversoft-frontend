import { StyleSheet, Text, View } from "react-native";

import { useSignInForm } from "@/features/auth/hooks/useSignInForm";
import { colors, radius, spacing, typography } from "@/shared/theme";
import { PrimaryButton } from "@/shared/ui/buttons/PrimaryButton";
import { TextField } from "@/shared/ui/inputs/TextField";
import { Screen } from "@/shared/ui/layout/Screen";

function getFieldError(
  field: { state: { meta: { isTouched: boolean; errors: unknown[] } } },
  isSubmitted: boolean
): string | undefined {
  return (field.state.meta.isTouched || isSubmitted) && field.state.meta.errors.length > 0
    ? String(field.state.meta.errors[0])
    : undefined;
}

export function SignInScreen(): React.JSX.Element {
  const { form, loginMutation } = useSignInForm();

  return (
    <Screen
      title="Inversoft mobile"
      subtitle="Gestiona cobros, cartera, clientes y rutas desde una sola app."
      scrollable={false}
      showAppHeader={false}
    >
      <View style={styles.authShell}>
        <View style={styles.heroCard}>
          <Text style={styles.heroOverline}>SaaS multi-tenant</Text>
          <Text style={styles.heroTitle}>Cobro inteligente para creditos de corto plazo</Text>
          <Text style={styles.heroDescription}>
            Disenado para administradores, supervisores y colaboradores con permisos por rol.
          </Text>
        </View>

        <View style={styles.formCard}>
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "El correo es obligatorio." : undefined
            }}
          >
            {(field) => (
              <TextField
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                label="Correo"
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                placeholder="admin@empresa.com"
                value={field.state.value}
                error={getFieldError(field, form.state.isSubmitted)}
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value.trim().length < 6 ? "La clave debe tener al menos 6 caracteres." : undefined
            }}
          >
            {(field) => (
              <TextField
                secureTextEntry
                autoCapitalize="none"
                label="Contrasena"
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                placeholder="Tu clave"
                value={field.state.value}
                error={getFieldError(field, form.state.isSubmitted)}
              />
            )}
          </form.Field>

          {loginMutation.isError ? (
            <Text style={styles.errorText}>
              No fue posible iniciar sesion. Verifica tus credenciales.
            </Text>
          ) : null}

          <PrimaryButton
            label="Ingresar"
            isLoading={loginMutation.isPending}
            onPress={() => form.handleSubmit()}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  authShell: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    gap: spacing.lg,
    paddingTop: spacing["2xl"]
  },
  heroCard: {
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryStrong,
    gap: spacing.sm
  },
  heroOverline: {
    color: colors.primarySoft,
    fontSize: typography.caption,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  heroTitle: {
    color: colors.surface,
    fontSize: typography.title,
    fontWeight: "800"
  },
  heroDescription: {
    color: "#D5E3FF",
    fontSize: typography.body,
    lineHeight: 22
  },
  formCard: {
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.lg,
    boxShadow: "0px 8px 18px rgba(11, 20, 37, 0.06)"
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption
  }
});
