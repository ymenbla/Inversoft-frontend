import { PropsWithChildren } from "react";

import { useSession } from "@/features/auth/context/SessionContext";
import { RoleAccess, hasAccess } from "@/features/auth/utils/access";
import { AccessDeniedState } from "@/shared/ui/feedback/AccessDeniedState";

type ProtectedContentProps = PropsWithChildren<{
  access: RoleAccess;
  fallbackDescription?: string;
}>;

export function ProtectedContent({
  access,
  fallbackDescription,
  children
}: ProtectedContentProps): React.JSX.Element {
  const { profile } = useSession();

  if (!hasAccess(profile, access)) {
    return <AccessDeniedState description={fallbackDescription} />;
  }

  return <>{children}</>;
}
