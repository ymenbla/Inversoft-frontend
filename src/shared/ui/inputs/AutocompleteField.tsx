import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { colors } from "@/shared/theme/colors";
import { radius } from "@/shared/theme/radius";
import { spacing } from "@/shared/theme/spacing";
import { typography } from "@/shared/theme/typography";

type AutocompleteOption = {
  key: string;
  label: string;
  value: string;
};

type AutocompleteFieldProps = Omit<TextInputProps, "onChangeText" | "value"> & {
  label: string;
  value: string;
  suggestions: AutocompleteOption[];
  error?: string;
  zIndex?: number;
  onChangeText: (value: string) => void;
  onSelectSuggestion?: (option: AutocompleteOption) => void;
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function AutocompleteField({
  label,
  value,
  suggestions,
  error,
  zIndex = 1,
  onChangeText,
  onSelectSuggestion,
  onBlur,
  onFocus,
  ...props
}: AutocompleteFieldProps): React.JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const isRequired = label.endsWith("*");
  const baseLabel = isRequired ? label.slice(0, -1).trimEnd() : label;

  const filteredSuggestions = useMemo(() => {
    const normalizedValue = normalizeText(value);
    const filtered = normalizedValue
      ? suggestions.filter((option) => normalizeText(option.label).includes(normalizedValue))
      : suggestions;

    return filtered.slice(0, 8);
  }, [suggestions, value]);

  const showSuggestions = isFocused && filteredSuggestions.length > 0;

  return (
    <View style={[styles.wrapper, { zIndex }]}>
      <Text style={styles.label}>
        {baseLabel}
        {isRequired ? <Text style={styles.requiredMark}> *</Text> : null}
      </Text>

      <View style={[styles.fieldShell, { zIndex }]}>
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, error ? styles.inputError : null]}
          value={value}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setTimeout(() => setIsFocused(false), 120);
            onBlur?.(event);
          }}
          {...props}
        />

        {showSuggestions ? (
          <View style={styles.suggestionsCard}>
            <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled style={styles.suggestionsScroll}>
              {filteredSuggestions.map((option) => (
                <Pressable
                  key={option.key}
                  onPress={() => {
                    onChangeText(option.value);
                    onSelectSuggestion?.(option);
                    setIsFocused(false);
                  }}
                  style={({ pressed }) => [
                    styles.suggestionItem,
                    pressed ? styles.suggestionItemPressed : null
                  ]}
                >
                  <Text style={styles.suggestionText}>{option.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
    position: "relative"
  },
  label: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  requiredMark: {
    color: colors.danger
  },
  fieldShell: {
    position: "relative",
    zIndex: 2
  },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    color: colors.text
  },
  inputError: {
    borderColor: colors.danger
  },
  suggestionsCard: {
    position: "absolute",
    top: 56,
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    boxShadow: "0px 8px 18px rgba(11, 20, 37, 0.08)",
    overflow: "hidden"
  },
  suggestionsScroll: {
    maxHeight: 220
  },
  suggestionItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  suggestionItemPressed: {
    backgroundColor: colors.surfaceMuted
  },
  suggestionText: {
    color: colors.text,
    fontSize: typography.body
  },
  error: {
    color: colors.danger,
    fontSize: typography.caption
  }
});
