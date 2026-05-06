import { TextField } from "@/shared/ui/inputs/TextField";
import { FilterFormCard } from "@/shared/ui/filters/FilterFormCard";

type CreditFiltersCardProps = {
  customerName: string;
  routeName: string;
  tags: string;
  onCustomerNameChange: (value: string) => void;
  onRouteNameChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onClearFilters: () => void;
};

export function CreditFiltersCard({
  customerName,
  routeName,
  tags,
  onCustomerNameChange,
  onRouteNameChange,
  onTagsChange,
  onClearFilters
}: CreditFiltersCardProps): React.JSX.Element {
  return (
    <FilterFormCard
      clearLabel="Limpiar filtros"
      description="Refina la cartera por cliente, ruta o tags para encontrar mas rapido el credito que buscas."
      onClear={onClearFilters}
    >
      <TextField
        label="Cliente"
        placeholder="Buscar por nombre del cliente"
        value={customerName}
        onChangeText={onCustomerNameChange}
      />

      <TextField
        label="Ruta"
        placeholder="Filtrar por nombre de ruta"
        value={routeName}
        onChangeText={onRouteNameChange}
      />

      <TextField
        autoCapitalize="none"
        label="Tags"
        placeholder="Filtrar por tag"
        value={tags}
        onChangeText={onTagsChange}
      />
    </FilterFormCard>
  );
}
