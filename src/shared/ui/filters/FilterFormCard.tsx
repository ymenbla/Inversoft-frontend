import { PropsWithChildren, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, componentTokens, fontWeights, shadows, spacing, typography } from "@/shared/theme";

type FilterFormCardProps = PropsWithChildren<{
  description?: string;
  clearLabel?: string;
  onClear?: () => void;
  clearIconName?: React.ComponentProps<typeof Ionicons>["name"];
  extraHeaderContent?: ReactNode;
}>;

export function FilterFormCard({
  description,
  clearLabel,
  onClear,
  clearIconName = "refresh-outline",
  extraHeaderContent,
  children
}: FilterFormCardProps): React.JSX.Element {
  const hasHeader = Boolean(description || (clearLabel && onClear) || extraHeaderContent);

  return (
    <View style={styles.card}>
      {hasHeader ? (
        <View style={styles.header}>
          {description ? <Text style={styles.description}>{description}</Text> : null}
          {extraHeaderContent}
          {clearLabel && onClear ? (
            <Pressable onPress={onClear} style={styles.clearButton}>
              <Ionicons color={colors.primary} name={clearIconName} size={16} />
              <Text style={styles.clearLabel}>{clearLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: componentTokens.card.defaultPadding,
    borderRadius: componentTokens.card.radius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadows.raisedCard
  },
  header: {
    gap: spacing.sm
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    ...fontWeights.regular
  },
  clearButton: {
    alignSelf: "flex-end",
    minHeight: componentTokens.chip.height,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: componentTokens.chip.paddingHorizontal,
    borderRadius: componentTokens.chip.radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted
  },
  clearLabel: {
    color: colors.primary,
    fontSize: typography.caption,
    ...fontWeights.extrabold
  }
});
