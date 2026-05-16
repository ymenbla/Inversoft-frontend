import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts
} from "@expo-google-fonts/manrope";
import { Text, TextInput } from "react-native";

export const fontFamilies = {
  regular: "Manrope_400Regular",
  medium: "Manrope_500Medium",
  semibold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
  extrabold: "Manrope_800ExtraBold"
} as const;

let typographyConfigured = false;

export function useAppFonts(): boolean {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold
  });

  return fontsLoaded;
}

export function configureGlobalTypography(): void {
  if (typographyConfigured) {
    return;
  }

  const TextWithDefaults = Text as typeof Text & {
    defaultProps?: { style?: unknown };
  };
  const TextInputWithDefaults = TextInput as typeof TextInput & {
    defaultProps?: { style?: unknown };
  };

  TextWithDefaults.defaultProps = TextWithDefaults.defaultProps ?? {};
  TextWithDefaults.defaultProps.style = [
    { fontFamily: fontFamilies.regular },
    TextWithDefaults.defaultProps.style
  ];

  TextInputWithDefaults.defaultProps = TextInputWithDefaults.defaultProps ?? {};
  TextInputWithDefaults.defaultProps.style = [
    { fontFamily: fontFamilies.regular },
    TextInputWithDefaults.defaultProps.style
  ];

  typographyConfigured = true;
}
