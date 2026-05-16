import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

import { colors, componentTokens, fontWeights, radius, shadows, spacing } from "@/shared/theme";

type TabIconName = keyof typeof Ionicons.glyphMap;

const tabIcons: Record<string, TabIconName> = {
  Menu: "menu",
  DailyCollections: "albums",
  NewCredit: "wallet",
  Payments: "cash",
  Customers: "people"
};

function TabItem({
  label,
  iconName,
  active,
  onPress
}: {
  label: string;
  iconName: TabIconName;
  active: boolean;
  onPress: () => void;
}): React.JSX.Element {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -2]) }]
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.4, 1]) }]
  }));

  return (
    <Pressable onPress={onPress} style={styles.tabPressable}>
      <Animated.View style={[styles.tabItem, animatedStyle]}>
        <Animated.View style={[styles.activeIndicator, indicatorStyle]} />
        <Ionicons
          color={active ? colors.primary : colors.textMuted}
          name={iconName}
          size={18}
          style={styles.tabIcon}
        />
        <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function CenterActionButton({ onPress }: { onPress: () => void }): React.JSX.Element {
  return (
    <View style={styles.centerActionSlot}>
      <Pressable onPress={onPress} style={styles.centerActionPressable}>
        <View style={styles.centerActionButton}>
          <Ionicons color={colors.surface} name="add" size={28} />
        </View>
      </Pressable>
    </View>
  );
}

export function BottomTabBar({
  state,
  descriptors,
  navigation
}: BottomTabBarProps): React.JSX.Element {
  const orderedRoutes = [...state.routes].sort((left, right) => {
    const routeOrder = ["Customers", "NewCredit", "DailyCollections", "Payments"];

    return routeOrder.indexOf(left.name) - routeOrder.indexOf(right.name);
  });
  const leftRoutes = orderedRoutes.slice(0, 2);
  const rightRoutes = orderedRoutes.slice(2);

  const handleCreateCreditPress = () => {
    navigation.navigate("NewCredit", { screen: "CreditCreate" });
  };

  const renderTabItem = (route: (typeof orderedRoutes)[number]) => {
    const routeIndex = state.routes.findIndex((item) => item.key === route.key);
    const isFocused = state.index === routeIndex;
    const onPress = () => {
      if (route.name === "Menu") {
        navigation.getParent()?.dispatch(DrawerActions.openDrawer());
        return;
      }

      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <View key={route.key} style={styles.tabSlot}>
        <TabItem
          active={isFocused}
          iconName={tabIcons[route.name] ?? "ellipse"}
          label={descriptors[route.key]?.options.title ?? route.name}
          onPress={onPress}
        />
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {leftRoutes.map(renderTabItem)}
        <CenterActionButton onPress={handleCreateCreditPress} />
        {rightRoutes.map(renderTabItem)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.lg
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.floating,
    overflow: "visible"
  },
  tabSlot: {
    flex: 1
  },
  tabPressable: {
    flex: 1
  },
  tabItem: {
    minHeight: 56,
    marginHorizontal: 2,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    gap: 4,
    backgroundColor: colors.surface
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    left: spacing.md,
    right: spacing.md,
    height: 3,
    borderBottomLeftRadius: radius.pill,
    borderBottomRightRadius: radius.pill,
    backgroundColor: colors.primary
  },
  tabIcon: {
    marginBottom: 1
  },
  tabLabel: {
    color: colors.textMuted,
    fontSize: 11,
    ...fontWeights.bold
  },
  tabLabelActive: {
    color: colors.primary
  },
  centerActionSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  centerActionPressable: {
    marginTop: componentTokens.fab.offsetTop,
    borderRadius: 999
  },
  centerActionButton: {
    width: componentTokens.fab.size,
    height: componentTokens.fab.size,
    borderRadius: componentTokens.fab.size / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderWidth: componentTokens.fab.ringWidth,
    borderColor: colors.surface,
    ...shadows.floatingStrong
  }
});
