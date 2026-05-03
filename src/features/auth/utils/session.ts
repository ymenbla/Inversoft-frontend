import {
  AuthTokensResponse,
  SessionProfile,
  UserRole
} from "@/features/auth/types/auth.types";
import { AppRole } from "@/features/auth/utils/access";

export function getAppRole(role: UserRole, isSupervisor: boolean): AppRole {
  if (role === "SysAdmin" || role === "CompanyAdmin") {
    return "admin";
  }

  return isSupervisor ? "supervisor" : "collaborator";
}

export function getRoleLabel(role: UserRole, isSupervisor: boolean): string {
  if (role === "SysAdmin") {
    return "Administrador Global";
  }

  if (role === "CompanyAdmin") {
    return "Administrador";
  }

  return isSupervisor ? "Supervisor" : "Colaborador";
}

export function buildSessionProfile(
  auth: AuthTokensResponse,
  email: string
): SessionProfile {
  return {
    displayName: email,
    role: auth.role,
    appRole: getAppRole(auth.role, auth.isSupervisor),
    roleLabel: getRoleLabel(auth.role, auth.isSupervisor),
    companyId: auth.companyId,
    companyCode: auth.companyId?.slice(0, 8).toUpperCase() ?? null,
    token: auth.accessToken,
    refreshToken: auth.refreshToken,
    userId: auth.userId,
    collectorId: auth.collectorId,
    partnerId: auth.partnerId,
    isSupervisor: auth.isSupervisor
  };
}
