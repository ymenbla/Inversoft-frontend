import { AppDrawerParamList, MainTabsParamList } from "@/app/navigation/types";
import { RoleAccess } from "@/features/auth/utils/access";

export type DrawerItemConfig = {
  routeName: keyof AppDrawerParamList;
  label: string;
  group: "Dashboard" | "Operaciones" | "Personal" | "Parametros" | "Configuracion";
  access: RoleAccess;
};

export type TabItemConfig = {
  routeName: keyof MainTabsParamList;
  label: string;
  access: RoleAccess;
};

export const drawerItemConfigs: DrawerItemConfig[] = [
  {
    routeName: "MainTabs",
    label: "Inicio / Resumen",
    group: "Dashboard",
    access: ["admin", "supervisor", "collaborator"]
  },
  {
    routeName: "Routes",
    label: "Rutas",
    group: "Operaciones",
    access: ["admin", "supervisor", "collaborator"]
  },
  {
    routeName: "Customers",
    label: "Clientes",
    group: "Operaciones",
    access: ["admin", "supervisor", "collaborator"]
  },
  {
    routeName: "Credits",
    label: "Cartera",
    group: "Operaciones",
    access: ["admin", "supervisor", "collaborator"]
  },
  {
    routeName: "Collaborators",
    label: "Colaboradores",
    group: "Personal",
    access: "admin"
  },
  {
    routeName: "Partners",
    label: "Socios",
    group: "Personal",
    access: "admin"
  },
  {
    routeName: "InterestRates",
    label: "Tasa de interes",
    group: "Parametros",
    access: "admin"
  },
  {
    routeName: "PaymentMethods",
    label: "Metodos de pagos",
    group: "Parametros",
    access: "admin"
  },
  {
    routeName: "Periodicities",
    label: "Periodicidad",
    group: "Parametros",
    access: "admin"
  },
  {
    routeName: "Tags",
    label: "Etiquetas",
    group: "Parametros",
    access: "admin"
  },
  {
    routeName: "Users",
    label: "Usuarios",
    group: "Configuracion",
    access: "admin"
  },
  {
    routeName: "Roles",
    label: "Roles",
    group: "Configuracion",
    access: "admin"
  }
];

export const tabItemConfigs: TabItemConfig[] = [
  { routeName: "Menu", label: "Menu", access: ["admin", "supervisor", "collaborator"] },
  { routeName: "Customers", label: "Clientes", access: ["admin", "supervisor", "collaborator"] },
  { routeName: "NewCredit", label: "Creditos", access: ["admin", "supervisor", "collaborator"] },
  { routeName: "Payments", label: "Pagos", access: ["admin", "supervisor", "collaborator"] },
  { routeName: "DailyCollections", label: "Cobros", access: ["admin", "supervisor", "collaborator"] }
];
