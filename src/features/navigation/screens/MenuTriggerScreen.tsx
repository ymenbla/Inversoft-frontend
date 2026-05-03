import { useEffect } from "react";
import { Text, View } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";

import { Screen } from "@/shared/ui/layout/Screen";

export function MenuTriggerScreen(): React.JSX.Element {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.getParent()?.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  return (
    <Screen
      title="Menu"
      subtitle="Acceso rapido a todos los modulos y configuraciones."
    >
      <View>
        <Text>Abriendo menu lateral...</Text>
      </View>
    </Screen>
  );
}
