import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { drawerItemConfigs } from "@/app/navigation/accessConfig";
import { useSession } from "@/features/auth/context/SessionContext";
import { hasAccess } from "@/features/auth/utils/access";
import { colors, fontWeights, radius, spacing, typography } from "@/shared/theme";

type DrawerContentProps = DrawerContentComponentProps & {
  isCollapsed: boolean;
  isMobileDrawer: boolean;
};

type DrawerIconName = keyof typeof Ionicons.glyphMap;

const drawerIcons: Record<string, DrawerIconName> = {
  MainTabs: "home",
  Routes: "map",
  Customers: "people",
  Credits: "wallet",
  Collaborators: "people",
  Partners: "briefcase",
  Users: "person-circle",
  Roles: "shield-checkmark",
  Tags: "pricetags",
  InterestRates: "trending-up",
  Notifications: "notifications"
};

const drawerGroupOrder = ["Dashboard", "Operaciones", "Personal", "Administracion"] as const;

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
      ? colors.primaryStrong
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
      {active && !collapsed ? <View style={styles.itemActiveBar} /> : null}
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

function GroupHeader({ label }: { label: string }): React.JSX.Element {
  return (
    <View style={styles.groupHeader}>
      <Text style={styles.groupTitle}>{label}</Text>
      <View style={styles.groupTitleLine} />
    </View>
  );
}

export function DrawerContent({
  navigation,
  state,
  isCollapsed,
  isMobileDrawer
}: DrawerContentProps): React.JSX.Element {
  const { profile, signOut } = useSession();
  const visibleItems = drawerItemConfigs.filter((item) =>
    hasAccess(profile, item.access)
  );
  const activeRouteName = state.routeNames[state.index];
  const groupedItems = drawerGroupOrder
    .map((group) => ({
      group,
      items: visibleItems.filter((item) => item.group === group)
    }))
    .filter((entry) => entry.items.length > 0);

  return (
    <DrawerContentScrollView
      contentContainerStyle={[
        styles.container,
        isCollapsed ? styles.containerCollapsed : null
      ]}
      scrollEnabled
    >
      {isMobileDrawer ? (
        <View style={styles.mobileHeader}>
          <View style={styles.mobileHeaderSpacer} />
          <Pressable
            accessibilityLabel="Cerrar menu"
            onPress={() => navigation.closeDrawer()}
            style={styles.mobileCloseButton}
          >
            <Ionicons color={colors.text} name="close" size={22} />
          </Pressable>
        </View>
      ) : null}

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
        {groupedItems.map(({ group, items }) => (
          <View key={group} style={styles.groupBlock}>
            {!isCollapsed ? <GroupHeader label={group} /> : null}
            <View style={styles.groupItems}>
              {items.map((item) => (
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
          </View>
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
  mobileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs
  },
  mobileHeaderSpacer: {
    width: 44,
    height: 44
  },
  mobileCloseButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  topSectionCollapsed: {
    alignItems: "center"
  },
  brandCard: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    gap: 2,
    minWidth: 0
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
    lineHeight: 24,
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
    gap: spacing.lg
  },
  groupBlock: {
    gap: spacing.xs
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xs
  },
  groupTitle: {
    color: colors.textMuted,
    fontSize: typography.overline,
    ...fontWeights.bold,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  groupTitleLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.surfaceMuted
  },
  groupItems: {
    gap: spacing.xs
  },
  item: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    position: "relative",
    overflow: "hidden"
  },
  itemCollapsed: {
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  itemActive: {
    backgroundColor: colors.primarySoft,
    marginHorizontal: spacing.xs
  },
  itemActiveBar: {
    position: "absolute",
    left: 0,
    top: 8,
    bottom: 8,
    width: 4,
    borderTopRightRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
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
    fontSize: 14,
    ...fontWeights.bold
  },
  itemLabelActive: {
    color: colors.primaryStrong
  },
  itemLabelDanger: {
    color: colors.danger
  },
  footer: {
    marginTop: "auto",
    paddingTop: spacing.lg
  }
});
