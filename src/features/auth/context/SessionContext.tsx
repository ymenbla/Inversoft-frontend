import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

import { AuthTokensResponse, SessionProfile } from "@/features/auth/types/auth.types";
import { buildSessionProfile } from "@/features/auth/utils/session";
import { env } from "@/shared/config/env";

type SessionContextValue = {
  isAuthenticated: boolean;
  profile: SessionProfile | null;
  signIn: (auth: AuthTokensResponse, email: string) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

function getPreviewProfile(): SessionProfile | null {
  if (!env.bypassLogin) {
    return null;
  }

  return {
    displayName: "preview@inversoft.local",
    role: "CompanyAdmin",
    appRole: "admin",
    roleLabel: "Administrador",
    companyId: null,
    companyCode: "PREVIEW",
    token: null,
    refreshToken: null,
    userId: null,
    collectorId: null,
    partnerId: null,
    isSupervisor: false
  };
}

export function SessionProvider({
  children
}: PropsWithChildren): React.JSX.Element {
  const [profile, setProfile] = useState<SessionProfile | null>(() => getPreviewProfile());

  const value = useMemo<SessionContextValue>(
    () => ({
      isAuthenticated: profile !== null,
      profile,
      signIn: (auth, email) => {
        setProfile(buildSessionProfile(auth, email));
      },
      signOut: () => setProfile(env.bypassLogin ? getPreviewProfile() : null)
    }),
    [profile]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }

  return context;
}
