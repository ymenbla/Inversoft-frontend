import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/features/auth/context/SessionContext";
import { deleteCustomer, updateCustomer } from "@/features/customers/api/customersApi";
import { PatchChange } from "@/features/customers/types/customer.types";

type UpdateCustomerParams = {
  customerId: string;
  changes: PatchChange[];
};

export function useCustomerMutations() {
  const { profile } = useSession();
  const queryClient = useQueryClient();

  const updateCustomerMutation = useMutation({
    mutationFn: async ({ customerId, changes }: UpdateCustomerParams) => {
      if (!profile?.token) {
        throw new Error("No hay sesion activa.");
      }

      return updateCustomer(customerId, changes, {
        token: profile.token,
        companyId: profile.companyId,
        companyCode: profile.companyCode
      });
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customers"] }),
        queryClient.invalidateQueries({
          queryKey: ["customer-detail", profile?.companyId, variables.customerId]
        })
      ]);
    }
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: string) => {
      if (!profile?.token) {
        throw new Error("No hay sesion activa.");
      }

      return deleteCustomer(customerId, {
        token: profile.token,
        companyId: profile.companyId,
        companyCode: profile.companyCode
      });
    },
    onSuccess: async (_data, customerId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customers"] }),
        queryClient.removeQueries({
          queryKey: ["customer-detail", profile?.companyId, customerId]
        })
      ]);
    }
  });

  return {
    updateCustomerMutation,
    deleteCustomerMutation
  };
}
