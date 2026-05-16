import { DefaultTheme, Theme } from "@react-navigation/native";

import { colors } from "@/shared/theme";

export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    notification: colors.alert,
    primary: colors.primary,
    text: colors.text
  }
};
