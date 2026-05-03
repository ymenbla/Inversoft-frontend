export type UserRole = "SysAdmin" | "CompanyAdmin" | "User";

export type AuthTokensResponse = {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
  role: UserRole;
  companyId: string | null;
  userId: string | null;
  collectorId: string | null;
  partnerId: string | null;
  isSupervisor: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type MeResponse = {
  identityUserId: string;
  role: UserRole;
  companyId: string | null;
  userId: string | null;
  collectorId: string | null;
  partnerId: string | null;
  isSupervisor: boolean;
};

export type SessionProfile = {
  displayName: string;
  role: UserRole;
  appRole: "admin" | "supervisor" | "collaborator";
  roleLabel: string;
  companyId: string | null;
  companyCode: string | null;
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
  collectorId: string | null;
  partnerId: string | null;
  isSupervisor: boolean;
};
