import { PropsWithChildren, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/shared/theme/colors";
import { radius } from "@/shared/theme/radius";
import { spacing } from "@/shared/theme/spacing";
import { typography } from "@/shared/theme/typography";

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
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },
  header: {
    gap: spacing.sm
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22
  },
  clearButton: {
    alignSelf: "flex-end",
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  clearLabel: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: "800"
  }
});
