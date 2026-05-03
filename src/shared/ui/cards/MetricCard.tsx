import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/shared/theme/colors";
import { radius } from "@/shared/theme/radius";
import { spacing } from "@/shared/theme/spacing";
import { typography } from "@/shared/theme/typography";

type MetricCardProps = {
  label: string;
  value: string;
  tone?: "primary" | "success" | "alert";
};

export function MetricCard({
  label,
  value,
  tone = "primary"
}: MetricCardProps): React.JSX.Element {
  const toneColor =
    tone === "success" ? colors.success : tone === "alert" ? colors.alert : colors.primary;

  return (
    <View style={styles.card}>
      <View style={[styles.badge, { backgroundColor: toneColor }]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 145,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm
  },
  badge: {
    width: 36,
    height: 6,
    borderRadius: 999
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.caption,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  value: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "800"
  }
});
