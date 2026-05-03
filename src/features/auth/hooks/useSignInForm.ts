import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";

import { login } from "@/features/auth/api/authApi";
import { useSession } from "@/features/auth/context/SessionContext";

type SignInFormValues = {
  email: string;
  password: string;
};

export function useSignInForm() {
  const { signIn } = useSession();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data, variables) => {
      signIn(data, variables.email);
    }
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    } satisfies SignInFormValues,
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value);
    }
  });

  return {
    form,
    loginMutation
  };
}
