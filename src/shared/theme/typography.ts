import { fontFamilies } from "@/shared/theme/fonts";

export const typography = {
  title: 28,
  heading: 20,
  body: 15,
  caption: 12,
  overline: 11
} as const;

export const fontWeights = {
  regular: {
    fontFamily: fontFamilies.regular,
    fontWeight: "400"
  },
  medium: {
    fontFamily: fontFamilies.medium,
    fontWeight: "500"
  },
  semibold: {
    fontFamily: fontFamilies.semibold,
    fontWeight: "600"
  },
  bold: {
    fontFamily: fontFamilies.bold,
    fontWeight: "700"
  },
  extrabold: {
    fontFamily: fontFamilies.extrabold,
    fontWeight: "800"
  }
} as const;
