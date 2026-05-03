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

import { colors } from "@/shared/theme/colors";
import { radius } from "@/shared/theme/radius";
import { spacing } from "@/shared/theme/spacing";
import { typography } from "@/shared/theme/typography";

type TabIconName = keyof typeof Ionicons.glyphMap;

const tabIcons: Record<string, TabIconName> = {
  Menu: "menu",
  DailyCollections: "calendar",
  NewCredit: "card",
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
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -4]) }],
    backgroundColor: active ? colors.primary : colors.surface
  }));

  return (
    <Pressable onPress={onPress} style={styles.tabPressable}>
      <Animated.View style={[styles.tabItem, animatedStyle]}>
        <Ionicons
          color={active ? colors.surface : colors.textMuted}
          name={iconName}
          size={18}
          style={styles.tabIcon}
        />
        <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function BottomTabBar({
  state,
  descriptors,
  navigation
}: BottomTabBarProps): React.JSX.Element {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
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
            <TabItem
              key={route.key}
              active={isFocused}
              iconName={tabIcons[route.name] ?? "ellipse"}
              label={descriptors[route.key]?.options.title ?? route.name}
              onPress={onPress}
            />
          );
        })}
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
    padding: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: "0px 10px 24px rgba(11, 20, 37, 0.08)"
  },
  tabPressable: {
    flex: 1
  },
  tabItem: {
    minHeight: 58,
    marginHorizontal: 2,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    gap: 4
  },
  tabIcon: {
    marginBottom: 1
  },
  tabLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700"
  },
  tabLabelActive: {
    color: colors.surface
  }
});
