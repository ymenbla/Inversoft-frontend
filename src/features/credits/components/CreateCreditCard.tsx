import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getMockCustomersResponse } from "@/features/customers/mock/mockCustomers";
import { CustomerListItem } from "@/features/customers/types/customer.types";
import { useActiveCustomerCreditsQuery } from "@/features/credits/hooks/useActiveCustomerCreditsQuery";
import { useCreateCreditForm } from "@/features/credits/hooks/useCreateCreditForm";
import { CreateCreditPayload, CreditListItem } from "@/features/credits/types/credit.types";
import { useRoutesQuery } from "@/features/routes/hooks/useRoutesQuery";
import { RouteListItem } from "@/features/routes/types/route.types";
import { colors, fontWeights, radius, spacing, typography } from "@/shared/theme";
import { PrimaryButton } from "@/shared/ui/buttons/PrimaryButton";
import { SecondaryButton } from "@/shared/ui/buttons/SecondaryButton";
import { TextField } from "@/shared/ui/inputs/TextField";

type CreateCreditCardProps = {
  mode?: "create" | "edit";
  initialCredit?: CreditListItem | null;
  onCreated?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
  submitTrigger?: number;
  onSubmitOverride?: (
    payload: CreateCreditPayload,
    context: {
      initialCredit: CreditListItem | null;
      selectedCustomer: CustomerListItem | null;
      selectedRoute: RouteListItem | null;
    }
  ) => Promise<void> | void;
};

const PERIODICITY_OPTIONS = [
  { label: "Diario", value: "1" },
  { label: "Semanal", value: "7" },
  { label: "Quicenal", value: "15" },
  { label: "Mensual", value: "30" }
] as const;

function getFirstError(field: {
  state: { meta: { isTouched: boolean; errors: unknown[] } };
}): string | undefined {
  return field.state.meta.isTouched && field.state.meta.errors.length > 0
    ? String(field.state.meta.errors[0])
    : undefined;
}

function parsePositiveNumber(value: string): number | null {
  const normalizedValue = value.replace(/[^0-9]/g, "");
  const normalized = Number(normalizedValue);

  if (!normalizedValue || !Number.isFinite(normalized) || normalized <= 0) {
    return null;
  }

  return normalized;
}

function formatCurrencyInput(value: string): string {
  const numericValue = value.replace(/[^0-9]/g, "");

  if (!numericValue) {
    return "";
  }

  return Number(numericValue).toLocaleString("es-CO");
}

export function CreateCreditCard({
  mode = "create",
  initialCredit = null,
  onCreated,
  onCancel,
  showActions = true,
  submitTrigger = 0,
  onSubmitOverride
}: CreateCreditCardProps): React.JSX.Element {
  const isEditing = mode === "edit";
  const [isCustomerSelectorOpen, setIsCustomerSelectorOpen] = useState(false);
  const [isRouteSelectorOpen, setIsRouteSelectorOpen] = useState(false);
  const [isPeriodicitySelectorOpen, setIsPeriodicitySelectorOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [hydratedCreditId, setHydratedCreditId] = useState<string | null>(null);
  const { form, submitCreditMutation } = useCreateCreditForm({
    onSuccess: () => {
      form.reset();
      setIsCustomerSelectorOpen(false);
      setIsRouteSelectorOpen(false);
      setIsPeriodicitySelectorOpen(false);
      setCustomerSearch("");
      setHydratedCreditId(null);
      onCreated?.();
    },
    onSubmitOverride: onSubmitOverride
      ? (payload) =>
          onSubmitOverride(payload, {
            initialCredit,
            selectedCustomer,
            selectedRoute
          })
      : undefined
  });

  const customersData = useMemo(
    () =>
      getMockCustomersResponse({
        pageNumber: 1,
        pageSize: 100,
        fullName: "",
        documentNumber: "",
        isActive: true,
        sort: "fullName"
      }),
    []
  );

  const routesQuery = useRoutesQuery({
    pageNumber: 1,
    pageSize: 20,
    name: "",
    isActive: true,
    sort: "name"
  });

  const selectedCustomer = useMemo<CustomerListItem | null>(
    () =>
      customersData.items.find(
        (item) => item.id === form.state.values.customerId
      ) ?? null,
    [customersData.items, form.state.values.customerId]
  );

  const selectedRoute = useMemo<RouteListItem | null>(
    () =>
      routesQuery.data?.items.find(
        (item) => item.id === form.state.values.routeId
      ) ?? null,
    [form.state.values.routeId, routesQuery.data?.items]
  );

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = customerSearch.trim().toLocaleLowerCase("es-CO");
    const customers = customersData.items;

    if (!normalizedSearch) {
      return customers;
    }

    return customers.filter((customer) => {
      const matchesName = customer.fullName
        .toLocaleLowerCase("es-CO")
        .includes(normalizedSearch);
      const matchesDocument = customer.documentNumber
        ? String(customer.documentNumber).includes(normalizedSearch)
        : false;

      return matchesName || matchesDocument;
    });
  }, [customerSearch, customersData.items]);

  const activeCreditQuery = useActiveCustomerCreditsQuery(selectedCustomer?.fullName ?? null);
  const activeCredits = activeCreditQuery.data?.items ?? [];
  const hasActiveCredit = activeCredits.length > 0;
  const isBlocked = isEditing
    ? !selectedRoute || customerSearch.trim().length === 0
    : !selectedCustomer || !selectedRoute || hasActiveCredit;
  const selectedPeriodicity =
    PERIODICITY_OPTIONS.find((option) => option.value === form.state.values.periodicityDays) ?? null;

  useEffect(() => {
    if (submitTrigger === 0) {
      return;
    }

    void form.handleSubmit();
  }, [form, submitTrigger]);

  useEffect(() => {
    if (selectedCustomer) {
      setCustomerSearch(selectedCustomer.fullName);
      setIsCustomerSelectorOpen(false);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (selectedRoute) {
      setIsRouteSelectorOpen(false);
    }
  }, [selectedRoute]);

  useEffect(() => {
    if (!isEditing || !initialCredit || hydratedCreditId === initialCredit.id) {
      return;
    }

    const matchedCustomer =
      customersData.items.find((item) => item.id === initialCredit.customerId) ??
      customersData.items.find((item) => item.fullName === initialCredit.customerName) ??
      null;
    const matchedRoute =
      (routesQuery.data?.items ?? []).find((item) => item.id === initialCredit.routeId) ??
      (routesQuery.data?.items ?? []).find((item) => item.name === initialCredit.routeName) ??
      null;

    form.setFieldValue(
      "customerId",
      matchedCustomer?.id ?? initialCredit.customerId ?? `locked-customer-${initialCredit.id}`
    );
    form.setFieldValue(
      "routeId",
      matchedRoute?.id ?? initialCredit.routeId ?? ""
    );
    form.setFieldValue("creditAmount", formatCurrencyInput(String(initialCredit.creditAmount.value)));
    form.setFieldValue(
      "installmentAmount",
      formatCurrencyInput(
        String(
          initialCredit.installmentAmount?.value ??
            Math.round(initialCredit.creditAmount.value / Math.max(initialCredit.term ?? 1, 1))
        )
      )
    );
    form.setFieldValue("interestRate", String(initialCredit.interestRate ?? 0.2));
    form.setFieldValue("periodicityDays", String(initialCredit.periodicityDays ?? 1));
    form.setFieldValue("term", String(initialCredit.term ?? 12));
    form.setFieldValue(
      "startDate",
      (initialCredit.startDate ?? new Date().toISOString()).slice(0, 10)
    );
    form.setFieldValue("tagIds", (initialCredit.tagIds ?? []).join(", "));
    setCustomerSearch(matchedCustomer?.fullName ?? initialCredit.customerName);
    if (matchedRoute || initialCredit.routeId) {
      setHydratedCreditId(initialCredit.id);
    }
  }, [
    customersData.items,
    form,
    hydratedCreditId,
    initialCredit,
    isEditing,
    routesQuery.data?.items
  ]);

  useEffect(() => {
    const creditAmount = parsePositiveNumber(form.state.values.creditAmount);
    const term = parsePositiveNumber(form.state.values.term);

    if (!creditAmount || !term) {
      form.setFieldValue("installmentAmount", "");
      return;
    }

    const nextInstallment = formatCurrencyInput(
      String(Math.round(creditAmount / term))
    );
    if (form.state.values.installmentAmount !== nextInstallment) {
      form.setFieldValue("installmentAmount", nextInstallment);
    }
  }, [form, form.state.values.creditAmount, form.state.values.term, form.state.values.installmentAmount]);

  return (
    <View style={styles.card}>
      <View style={styles.introBlock}>
        <Text style={styles.description}>
          {isEditing
            ? "Ajusta las condiciones del credito y guarda los cambios del registro seleccionado."
            : "Selecciona cliente y ruta, define las condiciones del credito y prepara el payload para crear el registro."}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relacion del credito</Text>

        <View style={styles.sectionCard}>
          <form.Field
            name="customerId"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "El cliente es obligatorio." : undefined
            }}
          >
            {(field) => (
              <View style={styles.selectorBlock}>
                <View style={styles.searchFieldWrap}>
                  <TextField
                    label="Cliente *"
                    placeholder="Escribe nombre o documento"
                    editable={!isEditing}
                    value={customerSearch}
                    onBlur={field.handleBlur}
                    onFocus={() => {
                      if (isEditing) {
                        return;
                      }
                      setIsRouteSelectorOpen(false);
                      setIsPeriodicitySelectorOpen(false);
                      setIsCustomerSelectorOpen(true);
                    }}
                    onChangeText={(value) => {
                      if (isEditing) {
                        return;
                      }
                      if (field.state.value) {
                        field.handleChange("");
                      }
                      setCustomerSearch(value);
                      setIsCustomerSelectorOpen(true);
                    }}
                    error={getFirstError(field)}
                  />
                  <Pressable
                    disabled={isEditing}
                    onPress={() => {
                      if (isEditing) {
                        return;
                      }
                      setIsPeriodicitySelectorOpen(false);
                      setIsRouteSelectorOpen(false);
                      setIsCustomerSelectorOpen((current) => !current);
                    }}
                    style={styles.searchFieldIcon}
                  >
                    <Ionicons color={colors.textMuted} name="chevron-down" size={16} />
                  </Pressable>
                </View>
                {isCustomerSelectorOpen && !isEditing ? (
                  <View style={styles.selectorDropdown}>
                    {filteredCustomers.length === 0 ? (
                      <View style={styles.emptyDropdownState}>
                        <Text style={styles.selectorOptionSubtitle}>
                          No hay clientes que coincidan con la busqueda.
                        </Text>
                      </View>
                    ) : null}
                    {filteredCustomers.map((customer) => {
                      const isSelected = field.state.value === customer.id;

                      return (
                        <Pressable
                          key={customer.id}
                          onPress={() => {
                            field.handleChange(customer.id);
                            field.handleBlur();
                            setCustomerSearch(customer.fullName);
                            setIsCustomerSelectorOpen(false);
                          }}
                          style={[
                            styles.selectorOption,
                            isSelected ? styles.selectorOptionSelected : null
                          ]}
                        >
                          <View style={styles.selectorOptionText}>
                            <Text style={styles.selectorOptionTitle}>{customer.fullName}</Text>
                            <Text style={styles.selectorOptionSubtitle}>
                              {customer.documentNumber
                                ? `CC ${customer.documentNumber.toLocaleString("es-CO")}`
                                : customer.isMissingReported
                                  ? "Con reporte de extravio"
                                  : "Disponible"}
                            </Text>
                          </View>
                          {isSelected ? (
                            <Ionicons color={colors.primary} name="checkmark" size={16} />
                          ) : null}
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
                {selectedCustomer?.documentNumber ? (
                  <Text style={styles.helperText}>
                    Documento: CC {selectedCustomer.documentNumber.toLocaleString("es-CO")}
                  </Text>
                ) : null}
              </View>
            )}
          </form.Field>

          <form.Field
            name="routeId"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "La ruta es obligatoria." : undefined
            }}
          >
            {(field) => (
              <View style={styles.selectorBlock}>
                <Text style={styles.selectorLabel}>
                  Ruta
                  <Text style={styles.requiredMark}> *</Text>
                </Text>
                <Pressable
                  onPress={() => {
                    setIsPeriodicitySelectorOpen(false);
                    setIsCustomerSelectorOpen(false);
                    setIsRouteSelectorOpen((current) => !current);
                  }}
                  style={styles.selectorField}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.selectorValue,
                      !selectedRoute ? styles.selectorPlaceholder : null
                    ]}
                  >
                    {selectedRoute ? selectedRoute.name : "Selecciona una ruta"}
                  </Text>
                  <Ionicons color={colors.textMuted} name="chevron-down" size={16} />
                </Pressable>
                {isRouteSelectorOpen ? (
                  <View style={styles.selectorDropdown}>
                    {(routesQuery.data?.items ?? []).map((route) => {
                      const isSelected = field.state.value === route.id;

                      return (
                        <Pressable
                          key={route.id}
                          onPress={() => {
                            field.handleChange(route.id);
                            field.handleBlur();
                            setIsRouteSelectorOpen(false);
                          }}
                          style={[
                            styles.selectorOption,
                            isSelected ? styles.selectorOptionSelected : null
                          ]}
                        >
                          <View style={styles.selectorOptionText}>
                            <Text style={styles.selectorOptionTitle}>{route.name}</Text>
                            <Text style={styles.selectorOptionSubtitle}>
                              Cobrador {route.collectorName} | Supervisor {route.supervisorName}
                            </Text>
                          </View>
                          {isSelected ? (
                            <Ionicons color={colors.primary} name="checkmark" size={16} />
                          ) : null}
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
                {getFirstError(field) ? <Text style={styles.errorText}>{getFirstError(field)}</Text> : null}
              </View>
            )}
          </form.Field>

          {selectedCustomer && !isEditing ? (
            <View style={styles.validationCard}>
              <Text style={styles.validationEyebrow}>Revision de cartera</Text>
              {activeCreditQuery.isLoading ? (
                <Text style={styles.validationText}>Revisando creditos activos del cliente...</Text>
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
                  No fue posible verificar la cartera activa. La validacion final quedara en backend.
                </Text>
              ) : (
                <Text style={styles.validationSuccess}>
                  No se detectaron creditos activos para este cliente.
                </Text>
              )}
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Condiciones</Text>

        <View style={styles.sectionCard}>
          <form.Field
            name="creditAmount"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "El monto del credito es obligatorio." : undefined
            }}
          >
            {(field) => (
              <TextField
                editable={!isEditing}
                keyboardType="decimal-pad"
                label="Monto del credito *"
                placeholder="Ej: 500000"
                prefix="$"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={(value) => {
                  if (isEditing) {
                    return;
                  }
                  field.handleChange(formatCurrencyInput(value));
                }}
                error={getFirstError(field)}
              />
            )}
          </form.Field>

          <form.Field
            name="interestRate"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "La tasa es obligatoria." : undefined
            }}
          >
            {(field) => (
              <TextField
                keyboardType="decimal-pad"
                label="Tasa de interes *"
                placeholder="Ej: 0.2"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                error={getFirstError(field)}
              />
            )}
          </form.Field>

          <form.Field
            name="periodicityDays"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "La periodicidad es obligatoria." : undefined
            }}
          >
            {(field) => (
              <View style={styles.selectorBlock}>
                <Text style={styles.selectorLabel}>
                  Periodicidad
                  <Text style={styles.requiredMark}> *</Text>
                </Text>
                <Pressable
                  onPress={() => {
                    setIsCustomerSelectorOpen(false);
                    setIsRouteSelectorOpen(false);
                    setIsPeriodicitySelectorOpen((current) => !current);
                  }}
                  style={styles.selectorField}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.selectorValue,
                      !selectedPeriodicity ? styles.selectorPlaceholder : null
                    ]}
                  >
                    {selectedPeriodicity
                      ? `${selectedPeriodicity.label} (${selectedPeriodicity.value} dias)`
                      : "Selecciona una periodicidad"}
                  </Text>
                  <Ionicons color={colors.textMuted} name="chevron-down" size={16} />
                </Pressable>
                {isPeriodicitySelectorOpen ? (
                  <View style={styles.selectorDropdown}>
                    {PERIODICITY_OPTIONS.map((option) => {
                      const isSelected = field.state.value === option.value;

                      return (
                        <Pressable
                          key={option.value}
                          onPress={() => {
                            field.handleChange(option.value);
                            field.handleBlur();
                            setIsPeriodicitySelectorOpen(false);
                          }}
                          style={[
                            styles.selectorOption,
                            isSelected ? styles.selectorOptionSelected : null
                          ]}
                        >
                          <View style={styles.selectorOptionText}>
                            <Text style={styles.selectorOptionTitle}>{option.label}</Text>
                            <Text style={styles.selectorOptionSubtitle}>
                              {option.value} dias
                            </Text>
                          </View>
                          {isSelected ? (
                            <Ionicons color={colors.primary} name="checkmark" size={16} />
                          ) : null}
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
                {getFirstError(field) ? <Text style={styles.errorText}>{getFirstError(field)}</Text> : null}
              </View>
            )}
          </form.Field>

          <form.Field
            name="term"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "El plazo es obligatorio." : undefined
            }}
          >
            {(field) => (
              <TextField
                keyboardType="numeric"
                label="Plazo *"
                placeholder="Numero de cuotas"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={(value) => field.handleChange(value.replace(/[^0-9]/g, ""))}
                error={getFirstError(field)}
              />
            )}
          </form.Field>

          <form.Field
            name="installmentAmount"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "El valor de la cuota es obligatorio." : undefined
            }}
          >
            {(field) => (
              <View style={styles.readonlyFieldBlock}>
                <TextField
                  editable={false}
                  keyboardType="decimal-pad"
                  label="Valor de la cuota *"
                  placeholder="Se calcula automaticamente"
                  prefix="$"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                  error={getFirstError(field)}
                />
                <Text style={styles.helperText}>
                  Se calcula automaticamente segun monto del credito y plazo.
                </Text>
              </View>
            )}
          </form.Field>

          <form.Field
            name="startDate"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "La fecha de inicio es obligatoria." : undefined
            }}
          >
            {(field) => (
              <TextField
                label="Fecha de inicio *"
                placeholder="YYYY-MM-DD"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                error={getFirstError(field)}
              />
            )}
          </form.Field>

          <form.Field name="tagIds">
            {(field) => (
              <TextField
                autoCapitalize="none"
                label="Tags"
                placeholder="UUIDs separados por coma"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                error={getFirstError(field)}
              />
            )}
          </form.Field>
        </View>
      </View>

      {submitCreditMutation.isError ? (
        <Text style={styles.errorText}>
          {isEditing
            ? "No fue posible guardar los cambios del credito. Revisa los datos e intenta nuevamente."
            : "No fue posible crear el credito. Revisa los datos e intenta nuevamente."}
        </Text>
      ) : null}

      {submitCreditMutation.isSuccess ? (
        <Text style={styles.successText}>
          {isEditing ? "Cambios guardados correctamente." : "Credito creado correctamente."}
        </Text>
      ) : null}

      {showActions ? (
        <View style={styles.actions}>
          {onCancel ? (
            <SecondaryButton
              label="Cancelar"
              disabled={submitCreditMutation.isPending}
              onPress={onCancel}
            />
          ) : null}
          <PrimaryButton
            label={isEditing ? "Guardar cambios" : "Guardar credito"}
            disabled={isBlocked}
            isLoading={submitCreditMutation.isPending}
            onPress={() => form.handleSubmit()}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
    overflow: "visible"
  },
  introBlock: {
    gap: spacing.md
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    ...fontWeights.regular
  },
  section: {
    gap: spacing.md
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.extrabold
  },
  sectionCard: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.lg,
    overflow: "visible"
  },
  selectorBlock: {
    gap: spacing.sm
  },
  searchFieldWrap: {
    position: "relative"
  },
  searchFieldIcon: {
    position: "absolute",
    right: spacing.lg,
    top: 40,
    minHeight: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  selectorLabel: {
    color: colors.text,
    fontSize: typography.caption,
    ...fontWeights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  requiredMark: {
    color: colors.danger
  },
  selectorField: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  selectorValue: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.medium
  },
  selectorPlaceholder: {
    color: colors.textMuted
  },
  selectorDropdown: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden"
  },
  emptyDropdownState: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md
  },
  selectorOption: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  selectorOptionSelected: {
    backgroundColor: colors.primarySoft
  },
  selectorOptionText: {
    flex: 1,
    gap: 2
  },
  selectorOptionTitle: {
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.bold
  },
  selectorOptionSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.regular
  },
  validationCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border
  },
  validationEyebrow: {
    color: colors.textMuted,
    fontSize: 12,
    ...fontWeights.extrabold,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  validationText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
    ...fontWeights.regular
  },
  validationWarning: {
    color: colors.alert,
    fontSize: typography.caption,
    ...fontWeights.bold
  },
  validationSuccess: {
    color: colors.success,
    fontSize: typography.caption,
    ...fontWeights.bold
  },
  readonlyFieldBlock: {
    gap: spacing.xs
  },
  helperText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.regular
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption
  },
  successText: {
    color: colors.success,
    fontSize: typography.caption,
    ...fontWeights.bold
  },
  actions: {
    gap: spacing.md
  }
});
