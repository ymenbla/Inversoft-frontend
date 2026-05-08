import { PropsWithChildren } from "react";
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/shared/theme/colors";
import { spacing } from "@/shared/theme/spacing";
import { fontWeights, typography } from "@/shared/theme/typography";

type FullScreenModalProps = PropsWithChildren<{
  visible: boolean;
  title: string;
  actionLabel?: string;
  actionAccessibilityLabel?: string;
  onActionPress?: () => void;
  onClose: () => void;
}>;

export function FullScreenModal({
  visible,
  title,
  actionLabel,
  actionAccessibilityLabel,
  onActionPress,
  onClose,
  children
}: FullScreenModalProps): React.JSX.Element {
  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons color={colors.text} name="arrow-back" size={22} />
          </Pressable>

          <Text style={styles.title}>{title}</Text>

          {actionLabel && onActionPress ? (
            <Pressable
              accessibilityLabel={actionAccessibilityLabel ?? actionLabel}
              onPress={onActionPress}
              style={styles.actionButton}
            >
              <Text style={styles.actionLabel}>{actionLabel}</Text>
            </Pressable>
          ) : (
            <View style={styles.actionSpacer} />
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    minHeight: 64,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: colors.text,
    fontSize: typography.heading,
    ...fontWeights.extrabold
  },
  actionButton: {
    minWidth: 72,
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  actionLabel: {
    color: colors.primary,
    fontSize: typography.body,
    ...fontWeights.extrabold
  },
  actionSpacer: {
    width: 72
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 120
  }
});
