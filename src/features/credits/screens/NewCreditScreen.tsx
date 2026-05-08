import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { CreateCreditCard } from "@/features/credits/components/CreateCreditCard";
import { FullScreenModal } from "@/shared/ui/layout/FullScreenModal";

export function NewCreditScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const [submitTrigger, setSubmitTrigger] = useState(0);

  return (
    <FullScreenModal
      visible
      title="Nuevo credito"
      actionLabel="Guardar"
      actionAccessibilityLabel="Guardar credito"
      onActionPress={() => setSubmitTrigger((current) => current + 1)}
      onClose={() => navigation.goBack()}
    >
      <CreateCreditCard
        showActions={false}
        submitTrigger={submitTrigger}
        onCancel={() => navigation.goBack()}
        onCreated={() => navigation.goBack()}
      />
    </FullScreenModal>
  );
}
