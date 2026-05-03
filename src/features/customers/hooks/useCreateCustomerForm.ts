import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/features/auth/context/SessionContext";
import { createCustomer, updateCustomer } from "@/features/customers/api/customersApi";
import {
  CreateCustomerPayload,
  CustomerDetail,
  PatchChange
} from "@/features/customers/types/customer.types";

type CreateCustomerFormValues = {
  documentNumber: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  tagIds: string;
};

type UseCreateCustomerFormOptions = {
  mode?: "create" | "edit";
  customer?: CustomerDetail | null;
  onSuccess?: () => void;
  submitOverride?: (payload: CreateCustomerPayload) => Promise<void>;
};

function getInitialValues(customer?: CustomerDetail | null): CreateCustomerFormValues {
  if (!customer) {
    return {
      documentNumber: "",
      fullName: "",
      gender: "",
      phoneNumber: "",
      email: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "CO",
      latitude: "",
      longitude: "",
      tagIds: ""
    };
  }

  return {
    documentNumber: String(customer.documentNumber),
    fullName: customer.fullName,
    gender: customer.gender,
    phoneNumber: customer.phoneNumber,
    email: customer.email ?? "",
    address: customer.location.address,
    city: customer.location.city,
    state: customer.location.state ?? "",
    postalCode: customer.location.postalCode ?? "",
    country: customer.location.country || "CO",
    latitude:
      customer.location.latitude !== null && customer.location.latitude !== undefined
        ? String(customer.location.latitude)
        : "",
    longitude:
      customer.location.longitude !== null && customer.location.longitude !== undefined
        ? String(customer.location.longitude)
        : "",
    tagIds: customer.tags.map((tag) => tag.id).join(", ")
  };
}

export function useCreateCustomerForm({
  mode = "create",
  customer,
  onSuccess,
  submitOverride
}: UseCreateCustomerFormOptions = {}) {
  const { profile } = useSession();
  const queryClient = useQueryClient();

  const submitCustomerMutation = useMutation({
    mutationFn: async (payload: CreateCustomerPayload) => {
      if (!profile?.token) {
        throw new Error("No hay sesion activa.");
      }

      return createCustomer(payload, {
        token: profile.token,
        companyId: profile.companyId,
        companyCode: profile.companyCode
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      onSuccess?.();
    }
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async (changes: PatchChange[]) => {
      if (!profile?.token || !customer?.id) {
        throw new Error("No hay sesion activa o cliente seleccionado.");
      }

      return updateCustomer(customer.id, changes, {
        token: profile.token,
        companyId: profile.companyId,
        companyCode: profile.companyCode
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customers"] }),
        customer?.id
          ? queryClient.invalidateQueries({
              queryKey: ["customer-detail", profile?.companyId, customer.id]
            })
          : Promise.resolve()
      ]);
      onSuccess?.();
    }
  });

  const overrideSubmitMutation = useMutation({
    mutationFn: async (payload: CreateCustomerPayload) => {
      if (!submitOverride) {
        throw new Error("No hay handler de submit configurado.");
      }

      await submitOverride(payload);
    },
    onSuccess: async () => {
      onSuccess?.();
    }
  });

  const form = useForm({
    defaultValues: getInitialValues(customer) satisfies CreateCustomerFormValues,
    onSubmit: async ({ value }) => {
      const normalizedTagIds = value.tagIds
        .split(",")
        .map((tagId) => tagId.trim())
        .filter(Boolean);

      const payload: CreateCustomerPayload = {
        documentNumber: Number(value.documentNumber),
        fullName: value.fullName.trim(),
        gender: value.gender.trim(),
        phoneNumber: value.phoneNumber.trim(),
        email: value.email.trim() ? value.email.trim() : null,
        location: {
          address: value.address.trim(),
          city: value.city.trim(),
          state: value.state.trim() ? value.state.trim() : null,
          postalCode: value.postalCode.trim() ? value.postalCode.trim() : null,
          country: value.country.trim() || "CO",
          latitude: value.latitude.trim() ? Number(value.latitude) : null,
          longitude: value.longitude.trim() ? Number(value.longitude) : null
        },
        tagIds: normalizedTagIds.length > 0 ? normalizedTagIds : null
      };

      if (submitOverride) {
        await overrideSubmitMutation.mutateAsync(payload);
        return;
      }

      if (mode === "edit") {
        const changes: PatchChange[] = [
          { property: "documentNumber", value: payload.documentNumber },
          { property: "fullName", value: payload.fullName },
          { property: "gender", value: payload.gender },
          { property: "phoneNumber", value: payload.phoneNumber },
          { property: "email", value: payload.email },
          { property: "location.address", value: payload.location.address },
          { property: "location.city", value: payload.location.city },
          { property: "location.state", value: payload.location.state },
          { property: "location.postalCode", value: payload.location.postalCode },
          { property: "location.country", value: payload.location.country },
          { property: "location.latitude", value: payload.location.latitude },
          { property: "location.longitude", value: payload.location.longitude },
          { property: "tagIds", value: payload.tagIds ?? [] }
        ];

        await updateCustomerMutation.mutateAsync(changes);
        return;
      }

      await submitCustomerMutation.mutateAsync(payload);
    }
  });

  return {
    form,
    submitCustomerMutation: submitOverride
      ? overrideSubmitMutation
      : mode === "edit"
        ? updateCustomerMutation
        : submitCustomerMutation
  };
}
