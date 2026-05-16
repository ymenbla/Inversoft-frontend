import { Pressable, StyleSheet, Text, View } from "react-native";

import { colombiaCities, colombiaDepartments } from "@/shared/data/colombiaLocationsNormalized";
import { colors, componentTokens, fontWeights, radius, spacing, typography } from "@/shared/theme";
import { FilterFormCard } from "@/shared/ui/filters/FilterFormCard";
import { AutocompleteField } from "@/shared/ui/inputs/AutocompleteField";
import { TextField } from "@/shared/ui/inputs/TextField";

type CustomerFiltersCardProps = {
  fullName: string;
  documentNumber: string;
  gender: string;
  state: string;
  city: string;
  onClearFilters: () => void;
  onFullNameChange: (value: string) => void;
  onDocumentNumberChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
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

export function CustomerFiltersCard({
  fullName,
  documentNumber,
  gender,
  state,
  city,
  onClearFilters,
  onFullNameChange,
  onDocumentNumberChange,
  onGenderChange,
  onStateChange,
  onCityChange
}: CustomerFiltersCardProps): React.JSX.Element {
  const selectedDepartment = colombiaDepartments.find(
    (department) => normalizeText(department.name) === normalizeText(state)
  );

  const departmentSuggestions = colombiaDepartments.map((department) => ({
    key: String(department.id),
    label: department.name,
    value: department.name
  }));

  const citySuggestions = colombiaCities
    .filter((item) =>
      selectedDepartment ? item.departmentId === selectedDepartment.id : true
    )
    .map((item) => ({
      key: String(item.id),
      label: selectedDepartment ? item.name : `${item.name} - ${item.departmentName}`,
      value: item.name
    }));

  return (
    <FilterFormCard
      clearLabel="Limpiar filtros"
      description="Refina la busqueda por datos personales y ubicacion."
      onClear={onClearFilters}
    >

      <TextField
        label="Nombre"
        placeholder="Buscar por nombre"
        value={fullName}
        onChangeText={onFullNameChange}
      />

      <TextField
        label="Documento"
        keyboardType="numeric"
        placeholder="Buscar por documento"
        value={documentNumber}
        onChangeText={onDocumentNumberChange}
      />

      <AutocompleteField
        label="Departamento"
        placeholder="Filtrar por departamento"
        suggestions={departmentSuggestions}
        zIndex={3}
        value={state}
        onChangeText={(value) => {
          onStateChange(value);

          const matchedDepartment = colombiaDepartments.find(
            (department) => normalizeText(department.name) === normalizeText(value)
          );

          if (!matchedDepartment || !city.trim()) {
            return;
          }

          const cityBelongsToDepartment = colombiaCities.some(
            (item) =>
              item.departmentId === matchedDepartment.id &&
              normalizeText(item.name) === normalizeText(city)
          );

          if (!cityBelongsToDepartment) {
            onCityChange("");
          }
        }}
        onSelectSuggestion={(option) => {
          onStateChange(option.value);

          const matchedDepartment = colombiaDepartments.find(
            (department) => String(department.id) === option.key
          );

          if (!matchedDepartment || !city.trim()) {
            return;
          }

          const cityBelongsToDepartment = colombiaCities.some(
            (item) =>
              item.departmentId === matchedDepartment.id &&
              normalizeText(item.name) === normalizeText(city)
          );

          if (!cityBelongsToDepartment) {
            onCityChange("");
          }
        }}
      />

      <View style={styles.cityFieldBlock}>
        <AutocompleteField
          label="Ciudad"
          placeholder={
            selectedDepartment
              ? "Filtrar por ciudad"
              : "Primero selecciona un departamento"
          }
          suggestions={citySuggestions}
          zIndex={2}
          value={city}
          editable={Boolean(selectedDepartment) || city.length > 0}
          onChangeText={onCityChange}
          onSelectSuggestion={(option) => {
            onCityChange(option.value);

            const matchedCity = colombiaCities.find((item) => String(item.id) === option.key);
            if (!matchedCity) {
              return;
            }

            onStateChange(matchedCity.departmentName);
          }}
        />
        {!selectedDepartment ? (
          <Text style={styles.helperText}>
            Selecciona un departamento para filtrar mas rapido las ciudades.
          </Text>
        ) : null}
      </View>

      <View style={styles.radioField}>
        <Text style={styles.radioLabel}>Genero</Text>

        <View style={styles.radioRow}>
          {genderOptions.map((option) => {
            const isSelected = gender === option.value;

            return (
              <Pressable
                key={option.value}
                onPress={() => onGenderChange(isSelected ? "" : option.value)}
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

        {gender ? (
          <Pressable onPress={() => onGenderChange("")} style={styles.clearFilterButton}>
            <Text style={styles.clearFilterLabel}>Limpiar genero</Text>
          </Pressable>
        ) : null}
      </View>
    </FilterFormCard>
  );
}

const styles = StyleSheet.create({
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
  clearFilterButton: {
    alignSelf: "flex-start",
    minHeight: componentTokens.chip.height,
    paddingHorizontal: spacing.md,
    borderRadius: componentTokens.chip.radius,
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted
  },
  clearFilterLabel: {
    color: colors.primary,
    fontSize: typography.caption,
    ...fontWeights.bold
  },
  cityFieldBlock: {
    gap: spacing.xs
  },
  helperText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.regular
  }
});
