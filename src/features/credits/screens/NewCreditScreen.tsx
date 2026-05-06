import { CreateCreditCard } from "@/features/credits/components/CreateCreditCard";
import { Screen } from "@/shared/ui/layout/Screen";

export function NewCreditScreen(): React.JSX.Element {
  return (
    <Screen
      title="Nuevo credito"
      subtitle="Completa la informacion del credito y genera el payload de creacion."
    >
      <CreateCreditCard />
    </Screen>
  );
}
