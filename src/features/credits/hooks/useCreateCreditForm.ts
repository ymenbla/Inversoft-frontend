import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/features/auth/context/SessionContext";
import { createCredit } from "@/features/credits/api/creditsApi";
import { CreateCreditPayload } from "@/features/credits/types/credit.types";

type CreateCreditFormValues = {
  customerId: string;
  routeId: string;
  creditAmount: string;
  interestRate: string;
  periodicityDays: string;
  term: string;
  startDate: string;
};

export function useCreateCreditForm(onSuccess?: () => void) {
  const { profile } = useSession();
  const queryClient = useQueryClient();

  const createCreditMutation = useMutation({
    mutationFn: async (payload: CreateCreditPayload) => {
      if (!profile?.token) {
        throw new Error("No hay sesion activa.");
      }

      return createCredit(payload, {
        token: profile.token,
        companyId: profile.companyId,
        companyCode: profile.companyCode
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customer-active-credits"] });
      await queryClient.invalidateQueries({ queryKey: ["credits"] });
      onSuccess?.();
    }
  });

  const today = new Date().toISOString().slice(0, 10);

  const form = useForm({
    defaultValues: {
      customerId: "",
      routeId: "",
      creditAmount: "",
      interestRate: "",
      periodicityDays: "1",
      term: "",
      startDate: today
    } satisfies CreateCreditFormValues,
    onSubmit: async ({ value }) => {
      const payload: CreateCreditPayload = {
        customerId: value.customerId,
        routeId: value.routeId,
        creditAmount: Number(value.creditAmount),
        interestRate: Number(value.interestRate),
        periodicityDays: Number(value.periodicityDays),
        term: Number(value.term),
        startDate: new Date(value.startDate).toISOString(),
        tagIds: null
      };

      await createCreditMutation.mutateAsync(payload);
    }
  });

  return {
    form,
    createCreditMutation
  };
}
