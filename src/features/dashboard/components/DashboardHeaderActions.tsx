import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/shared/theme";

export function DashboardHeaderActions(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Pressable style={styles.badge}>
        <Text style={styles.badgeText}>3 alertas</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center"
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  badgeText: {
    color: colors.text,
    fontWeight: "700"
  }
});
