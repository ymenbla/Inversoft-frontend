import { RouteProp, useRoute } from "@react-navigation/native";

import { CreditsTabStackParamList } from "@/app/navigation/stacks/CreditsTabStackScreen";
import { CreditDetailContent } from "@/features/credits/components/CreditDetailContent";
import { Screen } from "@/shared/ui/layout/Screen";

type CreditDetailRouteProp = RouteProp<CreditsTabStackParamList, "CreditDetail">;

export function CreditDetailScreen(): React.JSX.Element {
  const route = useRoute<CreditDetailRouteProp>();

  return (
    <Screen title="Detalle del credito" subtitle="Resumen general del registro seleccionado.">
      <CreditDetailContent creditId={route.params.creditId} />
    </Screen>
  );
}
