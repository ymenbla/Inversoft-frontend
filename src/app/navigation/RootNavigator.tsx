import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { navigationTheme } from "@/app/navigation/navigationTheme";
import { AppDrawerScreen } from "@/app/navigation/stacks/AppDrawerScreen";
import { AuthStackScreen } from "@/app/navigation/stacks/AuthStackScreen";
import { RootStackParamList } from "@/app/navigation/types";
import { useSession } from "@/features/auth/context/SessionContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  const { isAuthenticated } = useSession();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppDrawerScreen} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
