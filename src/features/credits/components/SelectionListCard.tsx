import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/shared/theme";

type SelectionItem = {
  id: string;
  title: string;
  subtitle?: string;
  disabled?: boolean;
};

type SelectionListCardProps = {
  title: string;
  description: string;
  items: SelectionItem[];
  selectedId: string;
  emptyMessage: string;
  onSelect: (id: string) => void;
};

export function SelectionListCard({
  title,
  description,
  items,
  selectedId,
  emptyMessage,
  onSelect
}: SelectionListCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      ) : (
        <View style={styles.list}>
          {items.map((item) => {
            const isSelected = selectedId === item.id;

            return (
              <Pressable
                key={item.id}
                disabled={item.disabled}
                onPress={() => onSelect(item.id)}
                style={[
                  styles.item,
                  isSelected ? styles.itemSelected : null,
                  item.disabled ? styles.itemDisabled : null
                ]}
              >
                <Text style={[styles.itemTitle, isSelected ? styles.itemTitleSelected : null]}>
                  {item.title}
                </Text>
                {item.subtitle ? <Text style={styles.itemSubtitle}>{item.subtitle}</Text> : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },
  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "800"
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.body
  },
  list: {
    gap: spacing.sm
  },
  item: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: "transparent",
    gap: spacing.xs
  },
  itemSelected: {
    backgroundColor: "#F5F8FF",
    borderColor: colors.primary
  },
  itemDisabled: {
    opacity: 0.5
  },
  itemTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700"
  },
  itemTitleSelected: {
    color: colors.primaryStrong
  },
  itemSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption
  }
});
