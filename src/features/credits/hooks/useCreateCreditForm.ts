import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/features/auth/context/SessionContext";
import { createCredit } from "@/features/credits/api/creditsApi";
import { CreateCreditPayload } from "@/features/credits/types/credit.types";

type CreateCreditFormValues = {
  customerId: string;
  routeId: string;
  creditAmount: string;
  installmentAmount: string;
  interestRate: string;
  periodicityDays: string;
  term: string;
  startDate: string;
  tagIds: string;
};

type UseCreateCreditFormOptions = {
  onSuccess?: () => void;
  onSubmitOverride?: (payload: CreateCreditPayload) => Promise<void> | void;
};

export function useCreateCreditForm({
  onSuccess,
  onSubmitOverride
}: UseCreateCreditFormOptions = {}) {
  const { profile } = useSession();
  const queryClient = useQueryClient();

  const submitCreditMutation = useMutation({
    mutationFn: async (payload: CreateCreditPayload) => {
      if (onSubmitOverride) {
        return onSubmitOverride(payload);
      }

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
      installmentAmount: "",
      interestRate: "",
      periodicityDays: "1",
      term: "",
      startDate: today,
      tagIds: ""
    } satisfies CreateCreditFormValues,
    onSubmit: async ({ value }) => {
      const payload: CreateCreditPayload = {
        customerId: value.customerId,
        routeId: value.routeId,
        creditAmount: Number(value.creditAmount),
        installmentAmount: Number(value.installmentAmount),
        interestRate: Number(value.interestRate),
        periodicityDays: Number(value.periodicityDays),
        term: Number(value.term),
        startDate: new Date(value.startDate).toISOString(),
        tagIds: value.tagIds.trim()
          ? value.tagIds
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : null
      };

      await submitCreditMutation.mutateAsync(payload);
    }
  });

  return {
    form,
    submitCreditMutation
  };
}
