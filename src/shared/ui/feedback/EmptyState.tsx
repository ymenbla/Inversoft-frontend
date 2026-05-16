import { StyleSheet, Text, View } from "react-native";

import { colors, componentTokens, fontWeights, shadows, spacing, typography } from "@/shared/theme";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({
  title,
  description
}: EmptyStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: componentTokens.card.defaultPadding,
    borderRadius: componentTokens.card.radius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadows.card
  },
  title: {
    color: colors.text,
    fontSize: typography.heading,
    ...fontWeights.bold
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    ...fontWeights.regular
  }
});
