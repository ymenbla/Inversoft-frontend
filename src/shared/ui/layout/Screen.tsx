import { PropsWithChildren, ReactNode } from "react";
import { DrawerActions, useNavigation, useNavigationState } from "@react-navigation/native";
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

import { useDrawerLayout } from "@/app/navigation/DrawerLayoutContext";
import { colors, fontWeights, spacing, typography } from "@/shared/theme";

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
  const drawerLayout = useDrawerLayout();
  const { width } = useWindowDimensions();
  const isMobileViewport = width < MOBILE_BREAKPOINT;
  const shouldShowAppHeader = showAppHeader;
  const isDesktopDrawerExpanded =
    drawerLayout?.isDesktopViewport && !drawerLayout.isDrawerCollapsed;
  const currentRootRouteName = useNavigationState((state) => state.routes[state.index]?.name);
  const isNotificationsActive = currentRootRouteName === "Notifications";

  const handleOpenDrawer = () => {
    if (drawerLayout?.isDesktopViewport) {
      drawerLayout.toggleDesktopDrawer();
      return;
    }

    drawerNavigation?.dispatch(DrawerActions.openDrawer());
  };

  const handleOpenNotifications = () => {
    drawerNavigation?.navigate("Notifications");
  };

  const content = (
    <View style={styles.content}>
      {shouldShowAppHeader ? (
        <View style={styles.appTopBarBlock}>
          <View style={styles.appTopBar}>
            <Pressable
              onPress={handleOpenDrawer}
              style={styles.iconButton}
            >
              <Ionicons
                color={isDesktopDrawerExpanded ? colors.primary : colors.text}
                name="menu"
                size={22}
              />
            </Pressable>

            <View style={styles.wordmarkWrap}>
              <View style={styles.wordmark}>
                <Text style={styles.wordmarkPrimary}>Inver</Text>
                <Text style={styles.wordmarkSecondary}>soft</Text>
              </View>
            </View>

            <Pressable onPress={handleOpenNotifications} style={styles.notificationButton}>
              <Ionicons
                color={isNotificationsActive ? colors.primary : colors.text}
                name={isNotificationsActive ? "notifications" : "notifications-outline"}
                size={20}
              />
            </Pressable>
          </View>
          <View style={styles.appTopBarDivider} />
        </View>
      ) : null}

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {!isMobileViewport ? rightSlot : null}
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
  appTopBarBlock: {
    gap: spacing.md
  },
  appTopBar: {
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
  appTopBarDivider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.72
  },
  wordmarkWrap: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  wordmark: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-start"
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
