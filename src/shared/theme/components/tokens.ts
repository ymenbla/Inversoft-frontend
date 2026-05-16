import { radius } from "@/shared/theme/foundations/radius";
import { spacing } from "@/shared/theme/foundations/spacing";

export const componentTokens = {
  button: {
    primaryHeight: 52,
    secondaryHeight: 46
  },
  badge: {
    minHeight: 30,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    radius: radius.pill
  },
  chip: {
    height: 42,
    paddingHorizontal: spacing.lg,
    radius: radius.pill
  },
  card: {
    compactPadding: spacing.md,
    defaultPadding: spacing.lg,
    radius: radius.xl,
    compactRadius: radius.lg
  },
  input: {
    height: 52,
    dropdownOffset: 56
  },
  iconButton: {
    md: 46
  },
  fab: {
    size: 68,
    ringWidth: 4,
    offsetTop: -36
  }
} as const;
