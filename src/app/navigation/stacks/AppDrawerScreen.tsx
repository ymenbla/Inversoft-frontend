import { createDrawerNavigator } from "@react-navigation/drawer";
import { useState } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";

import { DrawerLayoutProvider } from "@/app/navigation/DrawerLayoutContext";
import { MainTabsScreen } from "@/app/navigation/stacks/MainTabsScreen";
import { AppDrawerParamList } from "@/app/navigation/types";
import { CollaboratorsScreen } from "@/features/collaborators/screens/CollaboratorsScreen";
import { CreditsOverviewScreen } from "@/features/credits/screens/CreditsOverviewScreen";
import { NotificationsScreen } from "@/features/notifications/screens/NotificationsScreen";
import { PartnersScreen } from "@/features/partners/screens/PartnersScreen";
import { RoutesScreen } from "@/features/routes/screens/RoutesScreen";
import { InterestRatesScreen } from "@/features/settings/screens/InterestRatesScreen";
import { PaymentMethodsScreen } from "@/features/settings/screens/PaymentMethodsScreen";
import { PeriodicitiesScreen } from "@/features/settings/screens/PeriodicitiesScreen";
import { TagsScreen } from "@/features/settings/screens/TagsScreen";
import { CustomersScreen } from "@/features/customers/screens/CustomersScreen";
import { RolesScreen } from "@/features/users/screens/RolesScreen";
import { UsersScreen } from "@/features/users/screens/UsersScreen";
import { colors } from "@/shared/theme";
import { DrawerContent } from "@/shared/ui/navigation/DrawerContent";

const Drawer = createDrawerNavigator<AppDrawerParamList>();
const DESKTOP_BREAKPOINT = 1024;
const DRAWER_EXPANDED_WIDTH = 296;
const DRAWER_COLLAPSED_WIDTH = 92;
const webDrawerTransitionStyle =
  Platform.OS === "web"
    ? ({
        transitionProperty: "width",
        transitionDuration: "220ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
      } as unknown as Record<string, unknown>)
    : undefined;
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
    <DrawerLayoutProvider
      value={{
        isDesktopViewport,
        isDrawerCollapsed: isCollapsed,
        toggleDesktopDrawer: () => setIsCollapsed((current) => !current)
      }}
    >
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
              borderRightColor: colors.border,
              ...webDrawerTransitionStyle
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
          <Drawer.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
          <Drawer.Screen name="Periodicities" component={PeriodicitiesScreen} />
          <Drawer.Screen name="Users" component={UsersScreen} />
          <Drawer.Screen name="Roles" component={RolesScreen} />
          <Drawer.Screen name="Tags" component={TagsScreen} />
          <Drawer.Screen name="InterestRates" component={InterestRatesScreen} />
          <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        </Drawer.Navigator>
      </View>
    </DrawerLayoutProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});
