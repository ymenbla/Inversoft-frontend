import { SessionProfile } from "@/features/auth/types/auth.types";

export type AppRole = "admin" | "supervisor" | "collaborator";

export type RoleAccess = AppRole | AppRole[];

export function normalizeRoleAccess(access: RoleAccess): AppRole[] {
  return Array.isArray(access) ? access : [access];
}

export function hasAccess(
  profile: SessionProfile | null,
  access: RoleAccess
): boolean {
  if (!profile) {
    return false;
  }

  return normalizeRoleAccess(access).includes(profile.appRole);
}
