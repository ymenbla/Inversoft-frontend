import { PropsWithChildren } from "react";
import { View } from "react-native";

import { colors } from "@/shared/theme/colors";

export function AppThemeProvider({
  children
}: PropsWithChildren): React.JSX.Element {
  return <View style={{ flex: 1, backgroundColor: colors.background }}>{children}</View>;
}
