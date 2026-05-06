import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useWindowDimensions } from "react-native";

import { tabItemConfigs } from "@/app/navigation/accessConfig";
import { CreditsTabStackScreen } from "@/app/navigation/stacks/CreditsTabStackScreen";
import { MainTabsParamList } from "@/app/navigation/types";
import { useSession } from "@/features/auth/context/SessionContext";
import { hasAccess } from "@/features/auth/utils/access";
import { DailyCollectionsScreen } from "@/features/collections/screens/DailyCollectionsScreen";
import { CustomersScreen } from "@/features/customers/screens/CustomersScreen";
import { PaymentsScreen } from "@/features/payments/screens/PaymentsScreen";
import { BottomTabBar } from "@/shared/ui/navigation/BottomTabBar";

const Tabs = createBottomTabNavigator<MainTabsParamList>();
const MOBILE_BREAKPOINT = 768;

export function MainTabsScreen(): React.JSX.Element {
  const { profile } = useSession();
  const { width } = useWindowDimensions();
  const isMobileViewport = width < MOBILE_BREAKPOINT;
  const visibleTabs = tabItemConfigs.filter(
    (item) => item.routeName !== "Menu" && hasAccess(profile, item.access)
  );

  return (
    <Tabs.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props: BottomTabBarProps) =>
        isMobileViewport ? <BottomTabBar {...props} /> : null
      }
    >
      {visibleTabs.map((tab) => (
        <Tabs.Screen
          key={tab.routeName}
          name={tab.routeName}
          component={getTabComponent(tab.routeName)}
          options={{ title: tab.label }}
        />
      ))}
    </Tabs.Navigator>
  );
}

function getTabComponent(routeName: keyof MainTabsParamList) {
  switch (routeName) {
    case "DailyCollections":
      return DailyCollectionsScreen;
    case "NewCredit":
      return CreditsTabStackScreen;
    case "Payments":
      return PaymentsScreen;
    case "Customers":
      return CustomersScreen;
    default:
      return DailyCollectionsScreen;
  }
}
