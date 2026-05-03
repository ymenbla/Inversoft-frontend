import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthStackParamList } from "@/app/navigation/types";
import { SignInScreen } from "@/features/auth/screens/SignInScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStackScreen(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  );
}
