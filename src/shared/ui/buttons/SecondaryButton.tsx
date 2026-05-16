import { Pressable, StyleSheet, Text } from "react-native";

import { colors, componentTokens, fontWeights, radius, shadows, spacing, typography } from "@/shared/theme";

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function SecondaryButton({
  label,
  onPress,
  disabled = false
}: SecondaryButtonProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.buttonDisabled : null,
        pressed && !disabled ? styles.buttonPressed : null
      ]}
    >
      <Text style={[styles.label, disabled ? styles.labelDisabled : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: componentTokens.button.secondaryHeight,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    ...shadows.card
  },
  buttonDisabled: {
    opacity: 0.55
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }]
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.bold
  },
  labelDisabled: {
    color: colors.textMuted
  }
});
