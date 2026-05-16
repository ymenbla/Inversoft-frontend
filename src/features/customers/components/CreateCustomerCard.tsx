import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

import { geocodeCustomerLocation } from "@/features/customers/api/geocodingApi";
import { LocationMapPreview } from "@/features/customers/components/LocationMapPreview";
import { useCreateCustomerForm } from "@/features/customers/hooks/useCreateCustomerForm";
import {
  CreateCustomerPayload,
  CustomerDetail
} from "@/features/customers/types/customer.types";
import { colombiaCities, colombiaDepartments } from "@/shared/data/colombiaLocationsNormalized";
import { colors, fontWeights, radius, spacing, typography } from "@/shared/theme";
import { PrimaryButton } from "@/shared/ui/buttons/PrimaryButton";
import { SecondaryButton } from "@/shared/ui/buttons/SecondaryButton";
import { AutocompleteField } from "@/shared/ui/inputs/AutocompleteField";
import { TextField } from "@/shared/ui/inputs/TextField";

type CreateCustomerCardProps = {
  onCreated?: () => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  initialCustomer?: CustomerDetail | null;
  onSubmitOverride?: (payload: CreateCustomerPayload) => Promise<void>;
  showActions?: boolean;
  submitTrigger?: number;
};

const genderOptions = [
  { label: "Masculino", value: "Masculino" },
  { label: "Femenino", value: "Femenino" }
] as const;

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getFirstError(field: {
  state: { meta: { isTouched: boolean; errors: unknown[] } };
}): string | undefined {
  return field.state.meta.isTouched && field.state.meta.errors.length > 0
    ? String(field.state.meta.errors[0])
    : undefined;
}

function syncCityWithDepartment(
  departmentName: string,
  currentCity: string,
  setCity: (value: string) => void
): void {
  const matchedDepartment = colombiaDepartments.find(
    (department) => normalizeText(department.name) === normalizeText(departmentName)
  );

  if (!matchedDepartment) {
    setCity("");
    return;
  }

  if (!currentCity.trim()) {
    return;
  }

  const cityExistsInDepartment = colombiaCities.some(
    (city) =>
      city.departmentId === matchedDepartment.id &&
      normalizeText(city.name) === normalizeText(currentCity)
  );

  if (!cityExistsInDepartment) {
    setCity("");
  }
}

export function CreateCustomerCard({
  onCreated,
  onCancel,
  mode = "create",
  initialCustomer,
  onSubmitOverride,
  showActions = true,
  submitTrigger = 0
}: CreateCustomerCardProps): React.JSX.Element {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [lastResolvedQuery, setLastResolvedQuery] = useState("");
  const [lastResolvedLabel, setLastResolvedLabel] = useState<string | null>(null);
  const { form, submitCustomerMutation } = useCreateCustomerForm({
    mode,
    customer: initialCustomer,
    submitOverride: onSubmitOverride,
    onSuccess: () => {
      if (mode === "create") {
        form.reset();
      }

      setLastResolvedQuery("");
      setLastResolvedLabel(null);
      setGeocodingError(null);
      setIsGeocoding(false);
      setSelectedDepartmentId(null);
      onCreated?.();
    }
  });
  const isEditMode = mode === "edit";
  const submitLabel = isEditMode ? "Guardar cambios" : "Guardar cliente";
  const successLabel = isEditMode
    ? "Cliente actualizado correctamente."
    : "Cliente creado correctamente.";
  const summaryDocument = form.state.values.documentNumber.trim();
  const summaryName = form.state.values.fullName.trim();

  useEffect(() => {
    if (!initialCustomer) {
      return;
    }

    const matchedDepartment = colombiaDepartments.find(
      (department) => normalizeText(department.name) === normalizeText(initialCustomer.location.state ?? "")
    );

    setSelectedDepartmentId(matchedDepartment?.id ?? null);
  }, [initialCustomer]);

  const { address, city, state } = {
    address: form.state.values.address.trim(),
    city: form.state.values.city.trim(),
    state: form.state.values.state.trim()
  };

  const selectedDepartment = colombiaDepartments.find(
    (department) => department.id === selectedDepartmentId
  ) ?? colombiaDepartments.find(
    (department) => normalizeText(department.name) === normalizeText(form.state.values.state)
  );

  useEffect(() => {
    if (selectedDepartment) {
      setSelectedDepartmentId(selectedDepartment.id);
      return;
    }

    setSelectedDepartmentId(null);
  }, [selectedDepartment]);

  useEffect(() => {
    if (!initialCustomer) {
      return;
    }

    const location = initialCustomer.location;
    setLastResolvedLabel(
      location.address
        ? `${location.address}, ${location.city}, ${location.state ?? ""}, Colombia`
        : `${location.city}, ${location.state ?? ""}, Colombia`
    );
    setLastResolvedQuery(
      `${location.address || "-"}__${location.city}__${location.state ?? ""}__CO`
    );
  }, [initialCustomer]);

  async function resolveMapLocation(queryKey: string): Promise<void> {
    setIsGeocoding(true);
    setGeocodingError(null);

    try {
      const result = await geocodeCustomerLocation({
        address,
        city,
        state,
        country: "Colombia"
      });

      if (!result) {
        setGeocodingError("No encontramos coordenadas para esta ubicacion.");
        return;
      }

      form.setFieldValue("latitude", String(Number(result.latitude.toFixed(6))));
      form.setFieldValue("longitude", String(Number(result.longitude.toFixed(6))));
      setLastResolvedQuery(queryKey);
      setLastResolvedLabel(
        address ? `${address}, ${city}, ${state}, Colombia` : `${city}, ${state}, Colombia`
      );
    } catch {
      setGeocodingError("No fue posible ubicar automaticamente la direccion.");
    } finally {
      setIsGeocoding(false);
    }
  }

  useEffect(() => {
    if (!city || !state) {
      setIsGeocoding(false);
      setGeocodingError(null);
      setLastResolvedQuery("");
      setLastResolvedLabel(null);
      return;
    }

    const queryKey = `${address || "-"}__${city}__${state}__CO`;
    if (queryKey === lastResolvedQuery) {
      return;
    }

    const timeoutId = setTimeout(() => {
      resolveMapLocation(queryKey).catch(() => undefined);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    address,
    city,
    state,
    lastResolvedQuery
  ]);

  useEffect(() => {
    if (submitTrigger === 0) {
      return;
    }

    void form.handleSubmit();
  }, [form, submitTrigger]);

  const citySuggestions = colombiaCities
    .filter((city) =>
      selectedDepartmentId ? city.departmentId === selectedDepartmentId : true
    )
    .map((city) => ({
      key: String(city.id),
      label: selectedDepartment
        ? city.name
        : `${city.name} - ${city.departmentName}`,
      value: city.name
    }));
  const departmentSuggestions = colombiaDepartments.map((department) => ({
    key: String(department.id),
    label: department.name,
    value: department.name
  }));

  return (
    <View style={styles.card}>
      <View style={styles.introBlock}>
        {isEditMode ? (
          <>
            <Text style={styles.sectionTitle}>Datos del cliente</Text>
            {(summaryName || summaryDocument) ? (
              <View style={styles.editSummaryCard}>
                {summaryName ? <Text style={styles.editSummaryName}>{summaryName}</Text> : null}
                {summaryDocument ? (
                  <Text style={styles.editSummaryMeta}>
                    Documento: {summaryDocument}
                  </Text>
                ) : null}
              </View>
            ) : null}
            <Text style={styles.description}>
              Actualiza los datos principales del cliente y valida la ubicacion antes de guardar.
            </Text>
          </>
        ) : (
          <Text style={styles.description}>
            Registro rapido para supervisor y colaborador. Luego podremos enlazarlo con una ruta y un credito.
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos personales</Text>

        <View style={styles.sectionCard}>
          <form.Field
            name="documentNumber"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "El documento es obligatorio." : undefined
            }}
          >
            {(field) => (
              <TextField
                keyboardType="numeric"
                label="Documento *"
                placeholder="Numero de documento"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={(value) => field.handleChange(value.replace(/[^0-9]/g, ""))}
                error={getFirstError(field)}
              />
            )}
          </form.Field>

          <form.Field
            name="fullName"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "El nombre es obligatorio." : undefined
            }}
          >
            {(field) => (
              <TextField
                label="Nombre completo *"
                placeholder="Nombre del cliente"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                error={getFirstError(field)}
              />
            )}
          </form.Field>

          <form.Field
            name="gender"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "El genero es obligatorio." : undefined
            }}
          >
            {(field) => {
              const error = getFirstError(field);

              return (
                <View style={styles.radioField}>
                  <Text style={styles.radioLabel}>
                    Genero
                    <Text style={styles.requiredMark}> *</Text>
                  </Text>

                  <View style={styles.radioRow}>
                    {genderOptions.map((option) => {
                      const isSelected = field.state.value === option.value;

                      return (
                        <Pressable
                          key={option.value}
                          onBlur={field.handleBlur}
                          onPress={() => field.handleChange(option.value)}
                          style={styles.radioOption}
                        >
                          <View style={[styles.radioOuter, isSelected ? styles.radioOuterSelected : null]}>
                            {isSelected ? <View style={styles.radioInner} /> : null}
                          </View>
                          <Text style={styles.radioOptionLabel}>{option.label}</Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>
              );
            }}
          </form.Field>

          <form.Field
            name="phoneNumber"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "El telefono es obligatorio." : undefined
            }}
          >
            {(field) => (
              <TextField
                keyboardType="phone-pad"
                label="Telefono *"
                placeholder="Numero celular"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                error={getFirstError(field)}
              />
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <TextField
                autoCapitalize="none"
                keyboardType="email-address"
                label="Correo"
                placeholder="Opcional"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                error={getFirstError(field)}
              />
            )}
          </form.Field>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ubicacion</Text>

        <View style={styles.sectionCard}>
          <form.Field
            name="address"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "La direccion es obligatoria." : undefined
            }}
          >
            {(field) => (
              <TextField
                label="Direccion *"
                placeholder="Direccion de residencia"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                error={getFirstError(field)}
              />
            )}
          </form.Field>

          <form.Field
            name="state"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "El departamento es obligatorio." : undefined
            }}
          >
            {(field) => (
              <AutocompleteField
                label="Departamento *"
                placeholder="Departamento"
                suggestions={departmentSuggestions}
                zIndex={3}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={(value) => {
                  field.handleChange(value);
                  const matchedDepartment = colombiaDepartments.find(
                    (department) => normalizeText(department.name) === normalizeText(value)
                  );
                  setSelectedDepartmentId(matchedDepartment?.id ?? null);
                  syncCityWithDepartment(value, form.state.values.city, (nextCity) => {
                    form.setFieldValue("city", nextCity);
                  });
                }}
                onSelectSuggestion={(option) => {
                  field.handleChange(option.value);
                  setSelectedDepartmentId(Number(option.key));
                  syncCityWithDepartment(option.value, form.state.values.city, (nextCity) => {
                    form.setFieldValue("city", nextCity);
                  });
                }}
                error={getFirstError(field)}
              />
            )}
          </form.Field>

          <form.Field
            name="city"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "La ciudad es obligatoria." : undefined
            }}
          >
            {(field) => (
              <AutocompleteField
                label="Ciudad *"
                placeholder="Ciudad"
                suggestions={citySuggestions}
                zIndex={2}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                onSelectSuggestion={(option) => {
                  field.handleChange(option.value);

                  const matchedCity = colombiaCities.find((city) => String(city.id) === option.key);
                  if (!matchedCity) {
                    return;
                  }

                  setSelectedDepartmentId(matchedCity.departmentId);
                  form.setFieldValue("state", matchedCity.departmentName);
                }}
                error={getFirstError(field)}
              />
            )}
          </form.Field>

          <form.Field name="postalCode">
            {(field) => (
              <TextField
                label="Codigo postal"
                placeholder="Opcional"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                error={getFirstError(field)}
              />
            )}
          </form.Field>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mapa</Text>
        <View style={styles.sectionCard}>
          <Text style={styles.mapIntroText}>
            Usa el mapa para confirmar visualmente la ubicacion del cliente. Si es necesario, ajusta el punto para mejorar las coordenadas.
          </Text>

          <LocationMapPreview
            address={form.state.values.address}
            city={form.state.values.city}
            latitude={form.state.values.latitude}
            longitude={form.state.values.longitude}
            state={form.state.values.state}
            onCoordinateChange={({
              latitude,
              longitude
            }: {
              latitude: number;
              longitude: number;
            }) => {
              form.setFieldValue("latitude", String(Number(latitude.toFixed(6))));
              form.setFieldValue("longitude", String(Number(longitude.toFixed(6))));
            }}
          />

          {isGeocoding ? <Text style={styles.helperText}>Buscando ubicacion en el mapa...</Text> : null}
          {geocodingError ? <Text style={styles.errorText}>{geocodingError}</Text> : null}

          <SecondaryButton
            label="Ubicar en mapa"
            disabled={!city || !state || isGeocoding}
            onPress={() => {
              void resolveMapLocation(`${address || "-"}__${city}__${state}__CO`);
            }}
          />

          <View style={styles.locationStatusCard}>
            <Text style={styles.locationStatusTitle}>Estado de la ubicacion</Text>
            <Text style={styles.locationStatusText}>
              {lastResolvedLabel
                ? `Ubicacion resuelta para: ${lastResolvedLabel}`
                : "Aun no hay una ubicacion resuelta en el mapa."}
            </Text>
            <Text style={styles.locationStatusText}>
              Latitud: {form.state.values.latitude || "Sin dato"}
            </Text>
            <Text style={styles.locationStatusText}>
              Longitud: {form.state.values.longitude || "Sin dato"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Etiquetas</Text>
        <View style={styles.sectionCard}>
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

      {submitCustomerMutation.isError ? (
        <Text style={styles.errorText}>
          {isEditMode
            ? "No fue posible actualizar el cliente. Revisa los datos e intenta nuevamente."
            : "No fue posible crear el cliente. Revisa los datos e intenta nuevamente."}
        </Text>
      ) : null}

      {submitCustomerMutation.isSuccess ? (
        <Text style={styles.successText}>{successLabel}</Text>
      ) : null}

      {showActions ? (
        <View style={styles.actions}>
          {onCancel ? (
            <SecondaryButton
              label="Cancelar"
              disabled={submitCustomerMutation.isPending}
              onPress={onCancel}
            />
          ) : null}
          <PrimaryButton
            label={submitLabel}
            isLoading={submitCustomerMutation.isPending}
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
  editSummaryCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs
  },
  editSummaryName: {
    color: colors.primaryStrong,
    fontSize: typography.heading,
    ...fontWeights.extrabold
  },
  editSummaryMeta: {
    color: colors.textMuted,
    fontSize: typography.body,
    ...fontWeights.bold
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
  radioField: {
    gap: spacing.sm
  },
  radioLabel: {
    color: colors.text,
    fontSize: typography.caption,
    ...fontWeights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  requiredMark: {
    color: colors.danger
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface
  },
  radioOuterSelected: {
    borderColor: colors.primary
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.primary
  },
  radioOptionLabel: {
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.semibold
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption
  },
  helperText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.regular
  },
  mapIntroText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    ...fontWeights.regular
  },
  locationStatusCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.xs
  },
  locationStatusTitle: {
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.extrabold
  },
  locationStatusText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
    ...fontWeights.regular
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
