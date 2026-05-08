import { startTransition, useDeferredValue, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { CreateCustomerCard } from "@/features/customers/components/CreateCustomerCard";
import { CustomerDetailCard } from "@/features/customers/components/CustomerDetailCard";
import {
  buildMockCustomersResponse,
  findMockCustomerDetail,
  mockCustomerDetailsSeed
} from "@/features/customers/mock/mockCustomers";
import { useCustomersQuery } from "@/features/customers/hooks/useCustomersQuery";
import { useCustomerDetailQuery } from "@/features/customers/hooks/useCustomerDetailQuery";
import { useCustomerMutations } from "@/features/customers/hooks/useCustomerMutations";
import { CustomerFiltersCard } from "@/features/customers/components/CustomerFiltersCard";
import { CustomerListItemCard } from "@/features/customers/components/CustomerListItemCard";
import {
  CreateCustomerPayload,
  CustomerDetail
} from "@/features/customers/types/customer.types";
import { MobileFullScreenModal } from "@/shared/ui/layout/MobileFullScreenModal";
import { Screen } from "@/shared/ui/layout/Screen";
import { EmptyState } from "@/shared/ui/feedback/EmptyState";
import { LoadingBlock } from "@/shared/ui/feedback/LoadingBlock";
import { colors } from "@/shared/theme/colors";
import { spacing } from "@/shared/theme/spacing";
import { fontWeights, typography } from "@/shared/theme/typography";

const USE_MOCK_CUSTOMERS = true;
const MOBILE_BREAKPOINT = 768;
const quickFilterOptions = [
  { label: "Todos", value: "all" },
  { label: "Activos", value: "active" },
  { label: "Inactivos", value: "inactive" }
] as const;

export function CustomersScreen(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const isMobileLayout = width < MOBILE_BREAKPOINT;
  const isDesktopLayout = width >= 1080;
  const [searchName, setSearchName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [gender, setGender] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [actionCustomerId, setActionCustomerId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [mobileSubmitTrigger, setMobileSubmitTrigger] = useState(0);
  const [mockCustomersState, setMockCustomersState] = useState<CustomerDetail[]>(
    mockCustomerDetailsSeed
  );

  const deferredSearchName = useDeferredValue(searchName);
  const deferredDocumentNumber = useDeferredValue(documentNumber);
  const deferredGender = useDeferredValue(gender);
  const { updateCustomerMutation, deleteCustomerMutation } = useCustomerMutations();
  const mockCustomersData = buildMockCustomersResponse(mockCustomersState, {
    pageNumber,
    pageSize: 10,
    fullName: deferredSearchName.trim(),
    documentNumber: deferredDocumentNumber.trim(),
    gender: deferredGender.trim(),
    state: stateFilter.trim(),
    city: cityFilter.trim(),
    isActive:
      activeFilter === "all" ? undefined : activeFilter === "active",
    sort: "fullName"
  });

  const customersQuery = useCustomersQuery(
    {
      pageNumber,
      pageSize: 10,
      fullName: deferredSearchName.trim(),
      documentNumber: deferredDocumentNumber.trim(),
      gender: deferredGender.trim(),
      state: stateFilter.trim(),
      city: cityFilter.trim(),
      isActive:
        activeFilter === "all" ? undefined : activeFilter === "active",
      sort: "fullName"
    },
    { enabled: !USE_MOCK_CUSTOMERS }
  );
  const customerDetailQuery = useCustomerDetailQuery(selectedCustomerId, {
    enabled: !USE_MOCK_CUSTOMERS
  });
  const customersData = USE_MOCK_CUSTOMERS ? mockCustomersData : customersQuery.data;
  const selectedCustomer = USE_MOCK_CUSTOMERS
    ? findMockCustomerDetail(mockCustomersState, selectedCustomerId)
    : customerDetailQuery.data;
  const editingCustomer = USE_MOCK_CUSTOMERS
    ? findMockCustomerDetail(mockCustomersState, editingCustomerId)
    : selectedCustomer;
  const isCustomersLoading = USE_MOCK_CUSTOMERS ? false : customersQuery.isLoading;
  const isCustomersError = USE_MOCK_CUSTOMERS ? false : customersQuery.isError;
  const isCustomersFetching = USE_MOCK_CUSTOMERS ? false : customersQuery.isFetching;
  const isDetailLoading = USE_MOCK_CUSTOMERS ? false : customerDetailQuery.isLoading;
  const isDetailError = USE_MOCK_CUSTOMERS ? false : customerDetailQuery.isError;
  const hasAdvancedFilters = Boolean(
    searchName.trim() ||
    documentNumber.trim() ||
    gender.trim() ||
    stateFilter.trim() ||
    cityFilter.trim()
  );

  const customers = customersData?.items ?? [];
  const summaryText = customersData
    ? `${customersData.totalCount} clientes encontrados`
    : "Consulta paginada desde el backend";
  const resultsStart = customersData
    ? (customersData.pageNumber - 1) * customersData.pageSize + 1
    : 0;
  const resultsEnd = customersData
    ? Math.min(
        customersData.pageNumber * customersData.pageSize,
        customersData.totalCount
      )
    : 0;

  function mapPayloadToMockCustomer(
    payload: CreateCustomerPayload,
    customerId: string
  ): CustomerDetail {
    return {
      id: customerId,
      documentNumber: payload.documentNumber,
      fullName: payload.fullName,
      gender: payload.gender,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
      isActive: true,
      isMissingReported: false,
      missingReportedAt: null,
      locationId: `loc-${customerId}`,
      location: {
        address: payload.location.address,
        city: payload.location.city,
        state: payload.location.state,
        country: payload.location.country,
        postalCode: payload.location.postalCode,
        latitude: payload.location.latitude,
        longitude: payload.location.longitude
      },
      tags: (payload.tagIds ?? []).map((tagId, index) => ({
        id: tagId,
        name: `Tag ${index + 1}`,
        isActive: true
      }))
    };
  }

  async function handleMockSubmit(payload: CreateCustomerPayload): Promise<void> {
    if (editingCustomerId) {
      setMockCustomersState((current) =>
        current.map((customer) =>
          customer.id === editingCustomerId
            ? {
                ...customer,
                ...mapPayloadToMockCustomer(payload, editingCustomerId),
                isActive: customer.isActive,
                isMissingReported: customer.isMissingReported,
                missingReportedAt: customer.missingReportedAt,
                locationId: customer.locationId
              }
            : customer
        )
      );
      setSelectedCustomerId(editingCustomerId);
      return;
    }

    const nextCustomerId = `cst-${String(Date.now()).slice(-6)}`;
    const nextCustomer = mapPayloadToMockCustomer(payload, nextCustomerId);
    setMockCustomersState((current) => [nextCustomer, ...current]);
    setSelectedCustomerId(nextCustomerId);
  }

  async function handleToggleActive(customerId: string): Promise<void> {
    setDeleteConfirmationId(null);

    if (USE_MOCK_CUSTOMERS) {
      setMockCustomersState((current) =>
        current.map((customer) =>
          customer.id === customerId
            ? { ...customer, isActive: !customer.isActive }
            : customer
        )
      );
      return;
    }

    const customer = customers.find((item) => item.id === customerId);
    if (!customer) {
      return;
    }

    await updateCustomerMutation.mutateAsync({
      customerId: customer.id,
      changes: [
        {
          property: "isActive",
          value: !customer.isActive
        }
      ]
    });
  }

  async function handleDelete(customerId: string): Promise<void> {
    if (deleteConfirmationId !== customerId) {
      setDeleteConfirmationId(customerId);
      return;
    }

    if (USE_MOCK_CUSTOMERS) {
      setMockCustomersState((current) =>
        current.filter((customer) => customer.id !== customerId)
      );
      setDeleteConfirmationId(null);
      if (selectedCustomerId === customerId) {
        setSelectedCustomerId(null);
        setIsDetailModalOpen(false);
      }
      if (actionCustomerId === customerId) {
        setActionCustomerId(null);
      }
      if (editingCustomerId === customerId) {
        setEditingCustomerId(null);
        setIsCreateOpen(false);
      }
      return;
    }

    await deleteCustomerMutation.mutateAsync(customerId);
    setDeleteConfirmationId(null);
    if (selectedCustomerId === customerId) {
      setSelectedCustomerId(null);
      setIsDetailModalOpen(false);
    }
    if (actionCustomerId === customerId) {
      setActionCustomerId(null);
    }
  }

  const detailCard = (
    <CustomerDetailCard
      customer={selectedCustomer}
      isLoading={isDetailLoading}
      isError={isDetailError}
      isUpdating={updateCustomerMutation.isPending}
      isDeleting={deleteCustomerMutation.isPending}
      updateErrorMessage={
        updateCustomerMutation.isError
          ? "No fue posible actualizar el cliente."
          : null
      }
      deleteErrorMessage={
        deleteCustomerMutation.isError
          ? "No fue posible eliminar el cliente."
          : null
      }
      onToggleActive={async () => {
        if (!selectedCustomer) {
          return;
        }
        await handleToggleActive(selectedCustomer.id);
      }}
      onDelete={async () => {
        if (!selectedCustomer) {
          return;
        }
        await handleDelete(selectedCustomer.id);
      }}
    />
  );

  const filtersContent = (
    <CustomerFiltersCard
      fullName={searchName}
      documentNumber={documentNumber}
      gender={gender}
      state={stateFilter}
      city={cityFilter}
      onClearFilters={() => {
        startTransition(() => {
          setPageNumber(1);
          setSelectedCustomerId(null);
          setActionCustomerId(null);
          setSearchName("");
          setDocumentNumber("");
          setGender("");
          setStateFilter("");
          setCityFilter("");
          setActiveFilter("all");
        });
      }}
      onFullNameChange={(value) => {
        startTransition(() => {
          setPageNumber(1);
          setSelectedCustomerId(null);
          setSearchName(value);
        });
      }}
      onDocumentNumberChange={(value) => {
        startTransition(() => {
          setPageNumber(1);
          setSelectedCustomerId(null);
          setDocumentNumber(value.replace(/[^0-9]/g, ""));
        });
      }}
      onGenderChange={(value) => {
        startTransition(() => {
          setPageNumber(1);
          setSelectedCustomerId(null);
          setGender(value);
        });
      }}
      onStateChange={(value) => {
        startTransition(() => {
          setPageNumber(1);
          setSelectedCustomerId(null);
          setStateFilter(value);
        });
      }}
      onCityChange={(value) => {
        startTransition(() => {
          setPageNumber(1);
          setSelectedCustomerId(null);
          setCityFilter(value);
        });
      }}
    />
  );

  const createCustomerContent = (
    <CreateCustomerCard
      key={editingCustomer ? `edit-${editingCustomer.id}` : "create-customer"}
      mode={editingCustomer ? "edit" : "create"}
      initialCustomer={editingCustomer}
      onSubmitOverride={USE_MOCK_CUSTOMERS ? handleMockSubmit : undefined}
      showActions={!isMobileLayout}
      submitTrigger={isMobileLayout ? mobileSubmitTrigger : 0}
      onCancel={() => {
        setIsCreateOpen(false);
        setEditingCustomerId(null);
      }}
      onCreated={() => {
        setPageNumber(1);
        setIsCreateOpen(false);
        setEditingCustomerId(null);
        setMobileSubmitTrigger(0);
      }}
    />
  );

  return (
    <>
      <Screen
        title="Clientes"
        subtitle={summaryText}
      >
        <View style={styles.toolbar}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.quickFiltersContent}
          showsHorizontalScrollIndicator={false}
          style={styles.quickFiltersScroll}
        >
          {quickFilterOptions.map((option) => {
            const isActive = option.value === activeFilter;

            return (
              <Pressable
                key={option.value}
                onPress={() => {
                  startTransition(() => {
                    setPageNumber(1);
                    setSelectedCustomerId(null);
                    setActiveFilter(option.value);
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
          onPress={() => setIsFiltersOpen((current) => !current)}
          style={[styles.toolbarButton, isFiltersOpen ? styles.toolbarButtonActive : null]}
          accessibilityLabel="Filtros"
        >
          {hasAdvancedFilters ? <View style={styles.filterBadge} /> : null}
          <Ionicons
            color={isFiltersOpen ? colors.surface : colors.text}
            name="options-outline"
            size={18}
          />
        </Pressable>
        </View>

        {isFiltersOpen && !isMobileLayout ? filtersContent : null}

        {isCreateOpen && !isMobileLayout ? createCustomerContent : null}

        {deleteConfirmationId ? (
          <Text style={styles.confirmDeleteText}>
            Pulsa de nuevo en "Eliminar cliente" para confirmar la eliminacion del registro.
          </Text>
        ) : null}

        <View style={[styles.directoryLayout, isDesktopLayout ? styles.directoryLayoutDesktop : null]}>
          <View style={styles.directoryColumn}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Directorio</Text>
              <View style={styles.sectionHeaderActions}>
                {isCustomersFetching ? <Text style={styles.fetchingLabel}>Actualizando...</Text> : null}
                <Pressable
                  onPress={() => {
                    setEditingCustomerId(null);
                    setMobileSubmitTrigger(0);
                    setIsCreateOpen((current) => !current);
                  }}
                  style={[styles.headerActionButton, isCreateOpen ? styles.headerActionButtonActive : null]}
                >
                  <Ionicons
                    color={isCreateOpen ? colors.surface : colors.text}
                    name="person-add-outline"
                    size={18}
                  />
                  <Text
                    style={[
                      styles.headerActionLabel,
                      isCreateOpen ? styles.headerActionLabelActive : null
                    ]}
                  >
                    Nuevo cliente
                  </Text>
                </Pressable>
              </View>
            </View>

            {isCustomersLoading ? <LoadingBlock /> : null}

            {isCustomersError ? (
              <EmptyState
                title="No fue posible cargar clientes"
                description="Revisa la sesion activa, el contexto de empresa y la conexion con el backend."
              />
            ) : null}

            {!isCustomersLoading && !isCustomersError && customers.length === 0 ? (
              <EmptyState
                title="Sin resultados"
                description="No encontramos clientes con los filtros actuales. Prueba limpiando la busqueda o cambiando el estado."
              />
            ) : null}

            {!isCustomersLoading && !isCustomersError
              ? customers.map((customer) => (
                  <View key={customer.id} style={styles.directoryEntry}>
                    <CustomerListItemCard
                      customer={customer}
                      isSelected={
                        isMobileLayout
                          ? actionCustomerId === customer.id
                          : selectedCustomerId === customer.id
                      }
                      isActionsVisible={actionCustomerId === customer.id}
                      onPress={() => {
                        if (isMobileLayout) {
                          setSelectedCustomerId(customer.id);
                          setIsDetailModalOpen(true);
                          setActionCustomerId(null);
                        } else {
                          setSelectedCustomerId((current) =>
                            current === customer.id ? null : customer.id
                          );
                        }
                        setDeleteConfirmationId(null);
                      }}
                      onLongPress={() => {
                        setActionCustomerId((current) =>
                          current === customer.id ? null : customer.id
                        );
                        setSelectedCustomerId(customer.id);
                        setDeleteConfirmationId(null);
                      }}
                      onView={() => {
                        setSelectedCustomerId(customer.id);
                        setDeleteConfirmationId(null);
                        setActionCustomerId(null);
                        setIsDetailModalOpen(true);
                      }}
                      onEdit={() => {
                        setSelectedCustomerId(customer.id);
                        setEditingCustomerId(customer.id);
                        setMobileSubmitTrigger(0);
                        setIsCreateOpen(true);
                        setIsDetailModalOpen(false);
                        setActionCustomerId(null);
                        setDeleteConfirmationId(null);
                      }}
                      onDelete={() => {
                        void handleDelete(customer.id);
                      }}
                      onToggleActive={() => {
                        void handleToggleActive(customer.id);
                      }}
                    />

                    {!isDesktopLayout && !isMobileLayout && selectedCustomerId === customer.id ? (
                      <View style={styles.inlineDetail}>
                        {detailCard}
                      </View>
                    ) : null}
                  </View>
                ))
              : null}

            {customersData ? (
              <View style={styles.paginationCard}>
                <View style={styles.paginationSummary}>
                  {customersData.totalPages > 1 ? (
                    <>
                      <Text style={styles.paginationTitle}>
                        Mostrando {resultsStart}-{resultsEnd} de {customersData.totalCount}
                      </Text>
                      <Text style={styles.paginationMeta}>
                        Pagina {customersData.pageNumber} de {customersData.totalPages}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.paginationTitle}>
                        Mostrando {customersData.totalCount} clientes
                      </Text>
                      <Text style={styles.paginationMeta}>
                        Todos los resultados estan en esta pagina
                      </Text>
                    </>
                  )}
                </View>

                {customersData.totalPages > 1 ? (
                  <View style={styles.paginationActions}>
                    <Pressable
                      accessibilityLabel="Pagina anterior"
                      accessibilityRole="button"
                      disabled={!customersData.hasPreviousPage}
                      onPress={() => setPageNumber((current) => Math.max(1, current - 1))}
                      style={({ pressed }) => [
                        styles.paginationIconButton,
                        !customersData.hasPreviousPage ? styles.paginationIconButtonDisabled : null,
                        pressed && customersData.hasPreviousPage ? styles.paginationIconButtonPressed : null
                      ]}
                    >
                      <Ionicons
                        color={customersData.hasPreviousPage ? colors.text : colors.textMuted}
                        name="chevron-back"
                        size={18}
                      />
                    </Pressable>
                    <Pressable
                      accessibilityLabel="Pagina siguiente"
                      accessibilityRole="button"
                      disabled={!customersData.hasNextPage}
                      onPress={() => setPageNumber((current) => current + 1)}
                      style={({ pressed }) => [
                        styles.paginationIconButton,
                        !customersData.hasNextPage ? styles.paginationIconButtonDisabled : null,
                        pressed && customersData.hasNextPage ? styles.paginationIconButtonPressed : null
                      ]}
                    >
                      <Ionicons
                        color={customersData.hasNextPage ? colors.text : colors.textMuted}
                        name="chevron-forward"
                        size={18}
                      />
                    </Pressable>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>

          {isDesktopLayout ? (
            <View style={styles.detailColumn}>
              {detailCard}
            </View>
          ) : null}
        </View>
      </Screen>

      {isMobileLayout ? (
        <>
          <MobileFullScreenModal
            visible={isFiltersOpen}
            title="Filtros"
            actionLabel="Listo"
            actionAccessibilityLabel="Cerrar filtros"
            onActionPress={() => {
              setIsFiltersOpen(false);
            }}
            onClose={() => {
              setIsFiltersOpen(false);
            }}
          >
            {filtersContent}
          </MobileFullScreenModal>

          <MobileFullScreenModal
            visible={isDetailModalOpen}
            title="Detalle del cliente"
            actionLabel="Editar"
            actionAccessibilityLabel="Editar cliente"
            onActionPress={() => {
              if (!selectedCustomerId) {
                return;
              }

              setEditingCustomerId(selectedCustomerId);
              setMobileSubmitTrigger(0);
              setIsDetailModalOpen(false);
              setIsCreateOpen(true);
              setDeleteConfirmationId(null);
            }}
            onClose={() => {
              setIsDetailModalOpen(false);
            }}
          >
            {detailCard}
          </MobileFullScreenModal>

          <MobileFullScreenModal
            visible={isCreateOpen}
            title={editingCustomer ? "Editar cliente" : "Nuevo cliente"}
            actionLabel="Guardar"
            actionAccessibilityLabel="Guardar cliente"
            onActionPress={() => setMobileSubmitTrigger((current) => current + 1)}
            onClose={() => {
              setIsCreateOpen(false);
              setEditingCustomerId(null);
              setMobileSubmitTrigger(0);
            }}
          >
            {createCustomerContent}
          </MobileFullScreenModal>
        </>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  directoryLayout: {
    gap: spacing.lg
  },
  directoryLayoutDesktop: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  directoryColumn: {
    flex: 1,
    gap: spacing.lg
  },
  detailColumn: {
    width: 360
  },
  directoryEntry: {
    gap: spacing.md
  },
  inlineDetail: {
    paddingLeft: spacing.md
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  sectionHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  quickFiltersScroll: {
    flex: 1
  },
  quickFiltersContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingRight: spacing.sm
  },
  quickFilterChip: {
    minHeight: 42,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
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
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.surface
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.heading,
    ...fontWeights.extrabold
  },
  fetchingLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    ...fontWeights.bold
  },
  headerActionButton: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  headerActionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  headerActionLabel: {
    color: colors.text,
    fontSize: typography.body,
    ...fontWeights.bold
  },
  headerActionLabelActive: {
    color: colors.surface
  },
  confirmDeleteText: {
    color: colors.danger,
    fontSize: typography.caption,
    ...fontWeights.bold
  },
  paginationCard: {
    padding: spacing.md,
    borderRadius: 18,
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
    borderRadius: 999,
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
