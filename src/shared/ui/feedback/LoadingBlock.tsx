import { ActivityIndicator, StyleSheet, View } from "react-native";

import { colors } from "@/shared/theme/colors";
import { spacing } from "@/shared/theme/spacing";

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
