import { ActivityIndicator, StyleSheet, View } from "react-native";

import { colors, spacing } from "@/shared/theme";

export function LoadingBlock(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl
  }
});
