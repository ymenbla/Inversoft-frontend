import { createDrawerNavigator } from "@react-navigation/drawer";
import { useState } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { MainTabsScreen } from "@/app/navigation/stacks/MainTabsScreen";
import { AppDrawerParamList } from "@/app/navigation/types";
import { CollaboratorsScreen } from "@/features/collaborators/screens/CollaboratorsScreen";
import { CreditsOverviewScreen } from "@/features/credits/screens/CreditsOverviewScreen";
import { NotificationsScreen } from "@/features/notifications/screens/NotificationsScreen";
import { PartnersScreen } from "@/features/partners/screens/PartnersScreen";
import { RoutesScreen } from "@/features/routes/screens/RoutesScreen";
import { InterestRatesScreen } from "@/features/settings/screens/InterestRatesScreen";
import { TagsScreen } from "@/features/settings/screens/TagsScreen";
import { CustomersScreen } from "@/features/customers/screens/CustomersScreen";
import { RolesScreen } from "@/features/users/screens/RolesScreen";
import { UsersScreen } from "@/features/users/screens/UsersScreen";
import { colors, radius, spacing } from "@/shared/theme";
import { DrawerContent } from "@/shared/ui/navigation/DrawerContent";

const Drawer = createDrawerNavigator<AppDrawerParamList>();
const DESKTOP_BREAKPOINT = 1024;
const DRAWER_EXPANDED_WIDTH = 296;
const DRAWER_COLLAPSED_WIDTH = 92;

export function AppDrawerScreen(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const isDesktopViewport = width >= DESKTOP_BREAKPOINT;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const drawerWidth = isDesktopViewport
    ? isCollapsed
      ? DRAWER_COLLAPSED_WIDTH
      : DRAWER_EXPANDED_WIDTH
    : width;

  return (
    <View style={styles.root}>
      <Drawer.Navigator
        id="app-drawer"
        drawerContent={(props) => (
          <DrawerContent
            {...props}
            isCollapsed={isDesktopViewport ? isCollapsed : false}
            isMobileDrawer={!isDesktopViewport}
          />
        )}
        screenOptions={{
          headerShown: false,
          drawerType: isDesktopViewport ? "permanent" : "front",
          drawerStyle: {
            backgroundColor: colors.surface,
            width: drawerWidth,
            borderRightWidth: 1,
            borderRightColor: colors.border
          },
          overlayColor: isDesktopViewport ? "transparent" : colors.overlay,
          sceneStyle: {
            backgroundColor: colors.background
          }
        }}
      >
        <Drawer.Screen name="MainTabs" component={MainTabsScreen} />
        <Drawer.Screen name="Routes" component={RoutesScreen} />
        <Drawer.Screen name="Customers" component={CustomersScreen} />
        <Drawer.Screen name="Credits" component={CreditsOverviewScreen} />
        <Drawer.Screen name="Collaborators" component={CollaboratorsScreen} />
        <Drawer.Screen name="Partners" component={PartnersScreen} />
        <Drawer.Screen name="Users" component={UsersScreen} />
        <Drawer.Screen name="Roles" component={RolesScreen} />
        <Drawer.Screen name="Tags" component={TagsScreen} />
        <Drawer.Screen name="InterestRates" component={InterestRatesScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>

      {isDesktopViewport ? (
        <Pressable
          onPress={() => setIsCollapsed((current) => !current)}
          style={[
            styles.collapseButton,
            {
              left: drawerWidth - 18
            }
          ]}
        >
          <Ionicons
            color={colors.text}
            name={isCollapsed ? "chevron-forward" : "chevron-back"}
            size={18}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  collapseButton: {
    position: "absolute",
    top: spacing["3xl"] + spacing.xs,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 10
  }
});
