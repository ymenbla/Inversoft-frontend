import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { colors } from "@/shared/theme/colors";
import { radius } from "@/shared/theme/radius";
import { spacing } from "@/shared/theme/spacing";
import { fontWeights, typography } from "@/shared/theme/typography";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  isLoading = false,
  disabled = false
}: PrimaryButtonProps): React.JSX.Element {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.surface} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg
  },
  buttonDisabled: {
    opacity: 0.55
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }]
  },
  label: {
    color: colors.surface,
    fontSize: typography.body,
    ...fontWeights.extrabold
  }
});
