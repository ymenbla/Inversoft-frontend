import { EmptyState } from "@/shared/ui/feedback/EmptyState";

type AccessDeniedStateProps = {
  description?: string;
};

export function AccessDeniedState({
  description = "Tu rol actual no tiene permisos para consultar este modulo."
}: AccessDeniedStateProps): React.JSX.Element {
  return (
    <EmptyState
      title="Acceso restringido"
      description={description}
    />
  );
}
