import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { colors } from "@/shared/theme/colors";
import { radius } from "@/shared/theme/radius";
import { spacing } from "@/shared/theme/spacing";
import { fontWeights, typography } from "@/shared/theme/typography";

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  prefix?: string;
};

export function TextField({
  label,
  error,
  prefix,
  ...props
}: TextFieldProps): React.JSX.Element {
  const isRequired = label.endsWith("*");
  const baseLabel = isRequired ? label.slice(0, -1).trimEnd() : label;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {baseLabel}
        {isRequired ? <Text style={styles.requiredMark}> *</Text> : null}
      </Text>
      <View style={[styles.inputShell, error ? styles.inputShellError : null]}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, prefix ? styles.inputWithPrefix : null]}
          {...props}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm
  },
  label: {
    color: colors.text,
    fontSize: typography.caption,
    ...fontWeights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  requiredMark: {
    color: colors.danger
  },
  inputShell: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg
  },
  inputShellError: {
    borderColor: colors.danger
  },
  prefix: {
    color: colors.textMuted,
    fontSize: typography.body,
    ...fontWeights.bold
  },
  input: {
    flex: 1,
    minHeight: 50,
    color: colors.text,
    ...fontWeights.medium
  },
  inputWithPrefix: {
    paddingLeft: spacing.sm
  },
  error: {
    color: colors.danger,
    fontSize: typography.caption
  }
});
