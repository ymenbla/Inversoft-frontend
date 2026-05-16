import { PropsWithChildren, ReactNode } from "react";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  useWindowDimensions,
  View
} from "react-native";

import { colors, fontWeights, radius, spacing, typography } from "@/shared/theme";

const MOBILE_BREAKPOINT = 768;

type ScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  scrollable?: boolean;
  showAppHeader?: boolean;
  titleStyle?: StyleProp<TextStyle>;
}>;

export function Screen({
  title,
  subtitle,
  rightSlot,
  scrollable = true,
  showAppHeader = true,
  titleStyle,
  children
}: ScreenProps): React.JSX.Element {
  const navigation = useNavigation();
  const drawerNavigation = navigation.getParent("app-drawer");
  const { width } = useWindowDimensions();
  const isMobileViewport = width < MOBILE_BREAKPOINT;
  const shouldShowMobileAppHeader = showAppHeader && isMobileViewport;

  const handleOpenDrawer = () => {
    drawerNavigation?.dispatch(DrawerActions.openDrawer());
  };

  const handleOpenNotifications = () => {
    drawerNavigation?.navigate("Notifications");
  };

  const content = (
    <View style={styles.content}>
      {shouldShowMobileAppHeader ? (
        <View style={styles.mobileTopBar}>
          <Pressable onPress={handleOpenDrawer} style={styles.iconButton}>
            <Ionicons color={colors.text} name="menu" size={22} />
          </Pressable>

          <View style={styles.wordmark}>
            <Text style={styles.wordmarkPrimary}>Inver</Text>
            <Text style={styles.wordmarkSecondary}>soft</Text>
          </View>

          <Pressable onPress={handleOpenNotifications} style={styles.notificationButton}>
            <Ionicons color={colors.text} name="notifications-outline" size={20} />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {!shouldShowMobileAppHeader ? rightSlot : null}
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {scrollable ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  scroll: {
    paddingBottom: 120
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.lg
  },
  mobileTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  iconButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  notificationButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  wordmark: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    flex: 1
  },
  wordmarkPrimary: {
    color: colors.text,
    fontSize: 24,
    ...fontWeights.extrabold,
    letterSpacing: -0.8
  },
  wordmarkSecondary: {
    color: colors.primary,
    fontSize: 24,
    ...fontWeights.extrabold,
    letterSpacing: -0.8
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md
  },
  headerText: {
    flex: 1,
    gap: spacing.xs
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    ...fontWeights.extrabold
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    ...fontWeights.regular
  }
});
