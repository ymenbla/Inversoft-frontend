import { startTransition, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { CreateCreditCard } from "@/features/credits/components/CreateCreditCard";
import { CreditDetailContent } from "@/features/credits/components/CreditDetailContent";
import { CreditFiltersCard } from "@/features/credits/components/CreditFiltersCard";
import { CreditListItemCard } from "@/features/credits/components/CreditListItemCard";
import {
  buildMockCreditsResponse,
  findMockCreditById,
  mockCreditsSeed
} from "@/features/credits/mock/mockCredits";
import { Screen } from "@/shared/ui/layout/Screen";
import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { FullScreenModal } from "@/shared/ui/layout/FullScreenModal";
import { colors } from "@/shared/theme/colors";
import { radius } from "@/shared/theme/radius";
import { spacing } from "@/shared/theme/spacing";
import { fontWeights, typography } from "@/shared/theme/typography";

const quickFilterOptions = [
  { label: "Todos", value: "" },
  { label: "Pendiente", value: "Pending" },
  { label: "Activo", value: "Active" },
  { label: "Pagado", value: "Paid" }
] as const;

const sortOptions = [
  { key: "latest-due", label: "Proximo pago mas lejano", value: "-nextDueDate" },
  { key: "closest-due", label: "Proximo pago mas cercano", value: "nextDueDate" },
  { key: "name-asc", label: "Nombre A-Z", value: "customerName" },
  { key: "balance-desc", label: "Mayor saldo", value: "-balance" }
] as const;

export function CreditsOverviewScreen(): React.JSX.Element {
  const [mockCreditsState, setMockCreditsState] = useState(mockCreditsSeed);
  const [pageNumber, setPageNumber] = useState(1);
  const [customerFilter, setCustomerFilter] = useState("");
  const [routeFilter, setRouteFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("-nextDueDate");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [createSubmitTrigger, setCreateSubmitTrigger] = useState(0);
  const [editSubmitTrigger, setEditSubmitTrigger] = useState(0);
  const [actionCreditId, setActionCreditId] = useState<string | null>(null);
  const [selectedCreditId, setSelectedCreditId] = useState<string | null>(null);
  const creditsData = useMemo(
    () =>
      buildMockCreditsResponse({
        pageNumber,
        pageSize: 4,
        customerName: customerFilter.trim() || undefined,
        routeName: routeFilter.trim() || undefined,
        tag: tagsFilter.trim() || undefined,
        status: status || undefined,
        sort,
        credits: mockCreditsState
      }),
    [customerFilter, mockCreditsState, pageNumber, routeFilter, sort, status, tagsFilter]
  );
  const credits = creditsData.items;
  const resultsStart = creditsData.totalCount
    ? (creditsData.pageNumber - 1) * creditsData.pageSize + 1
    : 0;
  const resultsEnd = creditsData.totalCount
    ? Math.min(creditsData.pageNumber * creditsData.pageSize, creditsData.totalCount)
    : 0;
  const selectedSortLabel =
    sortOptions.find((option) => option.value === sort)?.label ?? "Proximo pago mas lejano";
  const selectedCredit = findMockCreditById(selectedCreditId, mockCreditsState);
  const hasAdvancedFilters = Boolean(
    customerFilter.trim() || routeFilter.trim() || tagsFilter.trim()
  );

  function openCreditDetail(creditId: string) {
    setActionCreditId(null);
    setIsSortOpen(false);
    setIsEditOpen(false);
    setSelectedCreditId(creditId);
    setIsDetailOpen(true);
  }

  function openCreditEdit(creditId: string) {
    setActionCreditId(null);
    setIsSortOpen(false);
    setIsDetailOpen(false);
    setSelectedCreditId(creditId);
    setIsEditOpen(true);
  }

  return (
    <Screen
      title="Creditos"
      subtitle={`${mockCreditsSeed.length} creditos de ejemplo registrados`}
      titleStyle={styles.screenTitle}
    >
      <View style={styles.toolbar}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.quickFiltersContent}
          showsHorizontalScrollIndicator={false}
          style={styles.quickFiltersScroll}
        >
          {quickFilterOptions.map((option) => {
            const isActive = status === option.value;

            return (
              <Pressable
                key={option.label}
                onPress={() => {
                  startTransition(() => {
                    setPageNumber(1);
                    setStatus(option.value);
                  });
                }}
                style={[styles.quickFilterChip, isActive ? styles.quickFilterChipActive : null]}
              >
                <Text
                  style={[
                    styles.quickFilterChipText,
                    isActive ? styles.quickFilterChipTextActive : null
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable
          accessibilityLabel="Filtros"
          onPress={() => {
            setIsSortOpen(false);
            setIsFiltersOpen((current) => !current);
          }}
          style={[styles.toolbarButton, isFiltersOpen ? styles.toolbarButtonActive : null]}
        >
          {hasAdvancedFilters ? <View style={styles.filterBadge} /> : null}
          <Ionicons
            color={isFiltersOpen ? colors.surface : colors.text}
            name="options-outline"
            size={18}
          />
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Todos los creditos</Text>
        <Pressable
          onPress={() => {
            setIsSortOpen(false);
            setActionCreditId(null);
            setIsCreateOpen(true);
          }}
          style={styles.headerActionButton}
        >
          <Ionicons color={colors.text} name="add-outline" size={18} />
          <Text style={styles.headerActionLabel}>Nuevo</Text>
        </Pressable>
      </View>

      <View style={styles.sortCard}>
        <Ionicons color={colors.textMuted} name="swap-vertical-outline" size={18} />
        <Text style={styles.sortLabel}>Ordenar por</Text>
        <Pressable
          onPress={() => setIsSortOpen((current) => !current)}
          style={styles.sortSelectField}
        >
          <Text numberOfLines={1} style={styles.sortSelectText}>
            {selectedSortLabel}
          </Text>
          <Ionicons color={colors.textMuted} name="chevron-down" size={16} />
        </Pressable>
      </View>

      {isSortOpen ? (
        <View style={styles.sortDropdown}>
          {sortOptions.map((option) => {
            const isActive = sort === option.value;

            return (
              <Pressable
                key={option.key}
                onPress={() => {
                  startTransition(() => {
                    setPageNumber(1);
                    setSort(option.value);
                    setIsSortOpen(false);
                  });
                }}
                style={[
                  styles.sortDropdownItem,
                  isActive ? styles.sortDropdownItemActive : null
                ]}
              >
                <Text
                  style={[
                    styles.sortDropdownItemText,
                    isActive ? styles.sortDropdownItemTextActive : null
                  ]}
                >
                  {option.label}
                </Text>
                {isActive ? (
                  <Ionicons color={colors.primary} name="checkmark" size={16} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {credits.length === 0 ? (
        <EmptyState
          title="Sin creditos para mostrar"
          description="No encontramos registros con la pestaña seleccionada. Prueba cambiando el estado."
        />
      ) : null}

      {credits.map((credit) => (
        <CreditListItemCard
          key={credit.id}
          credit={credit}
          isSelected={actionCreditId === credit.id}
          isActionsVisible={actionCreditId === credit.id}
          onPress={() => openCreditDetail(credit.id)}
          onLongPress={() => {
            setIsSortOpen(false);
            setActionCreditId((current) => (current === credit.id ? null : credit.id));
          }}
          onView={() => openCreditDetail(credit.id)}
          onEdit={credit.status === "Pending" ? () => openCreditEdit(credit.id) : undefined}
          onDelete={
            credit.status === "Pending"
              ? () => {
                  setActionCreditId(null);
                  setIsSortOpen(false);
                  Alert.alert(
                    "Eliminar credito",
                    `Aqui eliminaremos el credito ${credit.id.slice(-3)}.`
                  );
                }
              : undefined
          }
          onPay={
            credit.status === "Active"
              ? () => {
                  setActionCreditId(null);
                  setIsSortOpen(false);
                  Alert.alert(
                    "Registrar pago",
                    `Aqui registraremos un pago para ${credit.customerName}.`
                  );
                }
              : undefined
          }
        />
      ))}

      {creditsData ? (
        <View style={styles.paginationCard}>
          <View style={styles.paginationSummary}>
            {creditsData.totalPages > 1 ? (
              <>
                <Text style={styles.paginationTitle}>
                  Mostrando {resultsStart}-{resultsEnd} de {creditsData.totalCount}
                </Text>
                <Text style={styles.paginationMeta}>
                  Pagina {creditsData.pageNumber} de {creditsData.totalPages}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.paginationTitle}>
                  Mostrando {creditsData.totalCount} creditos
                </Text>
                <Text style={styles.paginationMeta}>
                  Todos los resultados estan en esta pagina
                </Text>
              </>
            )}
          </View>

          {creditsData.totalPages > 1 ? (
            <View style={styles.paginationActions}>
              <Pressable
                accessibilityLabel="Pagina anterior"
                accessibilityRole="button"
                disabled={!creditsData.hasPreviousPage}
                onPress={() => setPageNumber((current) => Math.max(1, current - 1))}
                style={({ pressed }) => [
                  styles.paginationIconButton,
                  !creditsData.hasPreviousPage
                    ? styles.paginationIconButtonDisabled
                    : null,
                  pressed && creditsData.hasPreviousPage
                    ? styles.paginationIconButtonPressed
                    : null
                ]}
              >
                <Ionicons
                  color={creditsData.hasPreviousPage ? colors.text : colors.textMuted}
                  name="chevron-back"
                  size={18}
                />
              </Pressable>
              <Pressable
                accessibilityLabel="Pagina siguiente"
                accessibilityRole="button"
                disabled={!creditsData.hasNextPage}
                onPress={() => setPageNumber((current) => current + 1)}
                style={({ pressed }) => [
                  styles.paginationIconButton,
                  !creditsData.hasNextPage
                    ? styles.paginationIconButtonDisabled
                    : null,
                  pressed && creditsData.hasNextPage
                    ? styles.paginationIconButtonPressed
                    : null
                ]}
              >
                <Ionicons
                  color={creditsData.hasNextPage ? colors.text : colors.textMuted}
                  name="chevron-forward"
                  size={18}
                />
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : null}

      <FullScreenModal
        visible={isFiltersOpen}
        title="Filtros"
        actionLabel="Listo"
        actionAccessibilityLabel="Cerrar filtros"
        onActionPress={() => setIsFiltersOpen(false)}
        onClose={() => setIsFiltersOpen(false)}
      >
        <CreditFiltersCard
          customerName={customerFilter}
          routeName={routeFilter}
          tags={tagsFilter}
          onCustomerNameChange={(value) => {
            startTransition(() => {
              setPageNumber(1);
              setCustomerFilter(value);
            });
          }}
          onRouteNameChange={(value) => {
            startTransition(() => {
              setPageNumber(1);
              setRouteFilter(value);
            });
          }}
          onTagsChange={(value) => {
            startTransition(() => {
              setPageNumber(1);
              setTagsFilter(value);
            });
          }}
          onClearFilters={() => {
            startTransition(() => {
              setPageNumber(1);
              setCustomerFilter("");
              setRouteFilter("");
              setTagsFilter("");
            });
          }}
        />
      </FullScreenModal>

      <FullScreenModal
        visible={isCreateOpen}
        title="Nuevo credito"
        actionLabel="Guardar"
        actionAccessibilityLabel="Guardar credito"
        onActionPress={() => setCreateSubmitTrigger((current) => current + 1)}
        onClose={() => {
          setIsCreateOpen(false);
          setCreateSubmitTrigger(0);
        }}
      >
        <CreateCreditCard
          showActions={false}
          submitTrigger={createSubmitTrigger}
          onCancel={() => {
            setIsCreateOpen(false);
            setCreateSubmitTrigger(0);
          }}
          onCreated={() => {
            setIsCreateOpen(false);
            setCreateSubmitTrigger(0);
          }}
        />
      </FullScreenModal>

      <FullScreenModal
        visible={isDetailOpen}
        title={selectedCredit ? selectedCredit.customerName : "Detalle del credito"}
        actionLabel={selectedCredit?.status === "Pending" ? "Editar" : undefined}
        actionAccessibilityLabel="Editar credito"
        onActionPress={
          selectedCredit?.status === "Pending"
            ? () => {
                setIsDetailOpen(false);
                openCreditEdit(selectedCredit.id);
              }
            : undefined
        }
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedCreditId(null);
        }}
      >
        <CreditDetailContent
          credit={selectedCredit}
          creditId={selectedCreditId}
          onCollect={(credit) => {
            setIsDetailOpen(false);
            setActionCreditId(null);
            Alert.alert(
              "Registrar cobro",
              `Aqui registraremos un cobro para ${credit.customerName}.`
            );
          }}
        />
      </FullScreenModal>

      <FullScreenModal
        visible={isEditOpen}
        title={selectedCredit ? `Editar ${selectedCredit.customerName}` : "Editar credito"}
        actionLabel="Guardar"
        actionAccessibilityLabel="Guardar cambios del credito"
        onActionPress={() => setEditSubmitTrigger((current) => current + 1)}
        onClose={() => {
          setIsEditOpen(false);
          setEditSubmitTrigger(0);
          setSelectedCreditId(null);
        }}
      >
        <CreateCreditCard
          mode="edit"
          initialCredit={selectedCredit}
          showActions={false}
          submitTrigger={editSubmitTrigger}
          onCancel={() => {
            setIsEditOpen(false);
            setEditSubmitTrigger(0);
            setSelectedCreditId(null);
          }}
          onSubmitOverride={async (payload, context) => {
            setMockCreditsState((current) =>
              current.map((credit) => {
                if (credit.id !== selectedCreditId) {
                  return credit;
                }

                return {
                  ...credit,
                  customerId: payload.customerId,
                  routeId: payload.routeId,
                  customerName: context.selectedCustomer?.fullName ?? credit.customerName,
                  routeName: context.selectedRoute?.name ?? credit.routeName,
                  creditAmount: { value: payload.creditAmount },
                  installmentAmount: { value: payload.installmentAmount },
                  interestRate: payload.interestRate,
                  periodicityDays: payload.periodicityDays,
                  term: payload.term,
                  startDate: payload.startDate,
                  tagIds: payload.tagIds ?? []
                };
              })
            );
          }}
          onCreated={() => {
            setIsEditOpen(false);
            setEditSubmitTrigger(0);
          }}
        />
      </FullScreenModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  screenTitle: {
    fontSize: 30
  },
  quickFiltersScroll: {
    flex: 1
  },
  quickFiltersContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingRight: spacing.sm
  },
  quickFilterChip: {
    minHeight: 42,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center"
  },
  quickFilterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  quickFilterChipText: {
    color: colors.textMuted,
    fontSize: typography.body,
    ...fontWeights.bold
  },
  quickFilterChipTextActive: {
    color: colors.surface
  },
  toolbarButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface
  },
  toolbarButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  filterBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.alert,
    borderWidth: 2,
    borderColor: colors.surface
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    ...fontWeights.bold
  },
  headerActionButton: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  headerActionLabel: {
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.bold
  },
  sortCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  sortLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  sortSelectField: {
    flex: 1,
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  sortSelectText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.caption,
    ...fontWeights.bold
  },
  sortDropdown: {
    marginTop: -spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden"
  },
  sortDropdownItem: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  sortDropdownItemActive: {
    backgroundColor: colors.primarySoft
  },
  sortDropdownItemText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.semibold
  },
  sortDropdownItemTextActive: {
    color: colors.primaryStrong
  },
  paginationCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },
  paginationSummary: {
    gap: spacing.xs
  },
  paginationTitle: {
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.extrabold
  },
  paginationMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.regular
  },
  paginationActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm
  },
  paginationIconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center"
  },
  paginationIconButtonDisabled: {
    opacity: 0.5
  },
  paginationIconButtonPressed: {
    transform: [{ scale: 0.97 }]
  }
});
