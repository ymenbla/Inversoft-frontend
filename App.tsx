import "react-native-gesture-handler";
import "react-native-reanimated";

import { AppRoot } from "@/app/AppRoot";
import { configureGlobalTypography, useAppFonts } from "@/shared/theme";

configureGlobalTypography();

export default function App(): React.JSX.Element {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return <></>;
  }

  return <AppRoot />;
}
