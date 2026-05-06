import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CreditDetailScreen } from "@/features/credits/screens/CreditDetailScreen";
import { CreditsOverviewScreen } from "@/features/credits/screens/CreditsOverviewScreen";
import { NewCreditScreen } from "@/features/credits/screens/NewCreditScreen";

export type CreditsTabStackParamList = {
  CreditsOverview: undefined;
  CreditCreate: undefined;
  CreditDetail: { creditId: string };
};

const Stack = createNativeStackNavigator<CreditsTabStackParamList>();

export function CreditsTabStackScreen(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreditsOverview" component={CreditsOverviewScreen} />
      <Stack.Screen name="CreditCreate" component={NewCreditScreen} />
      <Stack.Screen name="CreditDetail" component={CreditDetailScreen} />
    </Stack.Navigator>
  );
}
