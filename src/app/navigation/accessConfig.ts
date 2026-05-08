import { AppDrawerParamList, MainTabsParamList } from "@/app/navigation/types";
import { RoleAccess } from "@/features/auth/utils/access";

export type DrawerItemConfig = {
  routeName: keyof AppDrawerParamList;
  label: string;
  access: RoleAccess;
};

export type TabItemConfig = {
  routeName: keyof MainTabsParamList;
  label: string;
  access: RoleAccess;
};

export const drawerItemConfigs: DrawerItemConfig[] = [
  { routeName: "MainTabs", label: "Inicio", access: ["admin", "supervisor", "collaborator"] },
  { routeName: "Routes", label: "Rutas", access: ["admin", "supervisor", "collaborator"] },
  { routeName: "Credits", label: "Cartera", access: ["admin", "supervisor", "collaborator"] },
  { routeName: "Collaborators", label: "Colaboradores", access: "admin" },
  { routeName: "Partners", label: "Socios", access: "admin" },
  { routeName: "Users", label: "Usuarios", access: "admin" },
  { routeName: "Roles", label: "Roles", access: "admin" },
  { routeName: "Notifications", label: "Notificaciones", access: "admin" }
];

export const tabItemConfigs: TabItemConfig[] = [
  { routeName: "Menu", label: "Menu", access: ["admin", "supervisor", "collaborator"] },
  { routeName: "Customers", label: "Clientes", access: ["admin", "supervisor", "collaborator"] },
  { routeName: "NewCredit", label: "Creditos", access: ["admin", "supervisor", "collaborator"] },
  { routeName: "Payments", label: "Pagos", access: ["admin", "supervisor", "collaborator"] },
  { routeName: "DailyCollections", label: "Cobros", access: ["admin", "supervisor", "collaborator"] }
];
