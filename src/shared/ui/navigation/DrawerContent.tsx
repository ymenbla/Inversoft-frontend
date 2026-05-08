import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { drawerItemConfigs } from "@/app/navigation/accessConfig";
import { useSession } from "@/features/auth/context/SessionContext";
import { hasAccess } from "@/features/auth/utils/access";
import { colors } from "@/shared/theme/colors";
import { radius } from "@/shared/theme/radius";
import { spacing } from "@/shared/theme/spacing";
import { fontWeights, typography } from "@/shared/theme/typography";

type DrawerContentProps = DrawerContentComponentProps & {
  isCollapsed: boolean;
};

type DrawerIconName = keyof typeof Ionicons.glyphMap;

const drawerIcons: Record<string, DrawerIconName> = {
  MainTabs: "grid",
  Routes: "map",
  Credits: "wallet",
  Collaborators: "people",
  Partners: "briefcase",
  Users: "person-circle",
  Roles: "shield-checkmark",
  Notifications: "notifications"
};

function SidebarItem({
  label,
  iconName,
  active,
  collapsed,
  danger = false,
  onPress
}: {
  label: string;
  iconName: DrawerIconName;
  active?: boolean;
  collapsed: boolean;
  danger?: boolean;
  onPress: () => void;
}): React.JSX.Element {
  const iconColor = danger
    ? colors.danger
    : active
      ? colors.surface
      : colors.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        active ? styles.itemActive : null,
        danger && !active ? styles.itemDanger : null,
        pressed ? styles.itemPressed : null,
        collapsed ? styles.itemCollapsed : null
      ]}
    >
      <Ionicons color={iconColor} name={iconName} size={20} />
      {!collapsed ? (
        <Text
          numberOfLines={1}
          style={[
            styles.itemLabel,
            active ? styles.itemLabelActive : null,
            danger && !active ? styles.itemLabelDanger : null
          ]}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

export function DrawerContent({
  navigation,
  state,
  isCollapsed
}: DrawerContentProps): React.JSX.Element {
  const { profile, signOut } = useSession();
  const visibleItems = drawerItemConfigs.filter((item) =>
    hasAccess(profile, item.access)
  );
  const activeRouteName = state.routeNames[state.index];

  return (
    <DrawerContentScrollView
      contentContainerStyle={[
        styles.container,
        isCollapsed ? styles.containerCollapsed : null
      ]}
      scrollEnabled
    >
      <View style={[styles.topSection, isCollapsed ? styles.topSectionCollapsed : null]}>
        <View style={[styles.brandCard, isCollapsed ? styles.brandCardCollapsed : null]}>
          <View style={styles.brandBadge}>
            <Ionicons color={colors.primaryStrong} name="person" size={22} />
          </View>
          {!isCollapsed ? (
            <View style={styles.brandTextBlock}>
              <Text style={styles.companyLabel}>
                {profile?.companyCode ? `Tenant ${profile.companyCode}` : "Tenant activo"}
              </Text>
              <Text style={styles.userName}>{profile?.displayName ?? "Usuario"}</Text>
              <Text style={styles.role}>{profile?.roleLabel ?? "Sin rol"}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.menu}>
        {visibleItems.map((item) => (
          <SidebarItem
            key={item.routeName}
            active={activeRouteName === item.routeName}
            collapsed={isCollapsed}
            iconName={drawerIcons[item.routeName] ?? "ellipse"}
            label={item.label}
            onPress={() => navigation.navigate(item.routeName)}
          />
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <SidebarItem
          collapsed={isCollapsed}
          danger
          iconName="log-out"
          label="Cerrar sesion"
          onPress={signOut}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    backgroundColor: colors.surface
  },
  containerCollapsed: {
    paddingHorizontal: spacing.md
  },
  topSection: {
    gap: spacing.md
  },
  topSectionCollapsed: {
    alignItems: "center"
  },
  brandCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm
  },
  brandCardCollapsed: {
    justifyContent: "center"
  },
  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft
  },
  brandBadgeText: {
    color: colors.primaryStrong,
    fontSize: typography.heading,
    ...fontWeights.extrabold
  },
  brandTextBlock: {
    flex: 1,
    gap: spacing.xs
  },
  companyLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  userName: {
    color: colors.text,
    fontSize: typography.heading,
    ...fontWeights.extrabold
  },
  role: {
    color: colors.textMuted,
    fontSize: typography.body,
    ...fontWeights.regular
  },
  divider: {
    height: 1,
    marginTop: spacing.lg,
    backgroundColor: colors.border
  },
  menu: {
    paddingTop: spacing.lg,
    gap: spacing.sm
  },
  item: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface
  },
  itemCollapsed: {
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  itemActive: {
    backgroundColor: colors.primary
  },
  itemDanger: {
    backgroundColor: "#FFF1F2"
  },
  itemPressed: {
    opacity: 0.85
  },
  itemLabel: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.bold
  },
  itemLabelActive: {
    color: colors.surface
  },
  itemLabelDanger: {
    color: colors.danger
  },
  footer: {
    marginTop: "auto",
    paddingTop: spacing.lg
  }
});
