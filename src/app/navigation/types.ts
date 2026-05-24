import { NavigatorScreenParams } from "@react-navigation/native";

import type { CreditsTabStackParamList } from "@/app/navigation/stacks/CreditsTabStackScreen";

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
};

export type AppDrawerParamList = {
  MainTabs: undefined;
  Routes: undefined;
  Customers: undefined;
  Credits: undefined;
  Collaborators: undefined;
  Partners: undefined;
  Users: undefined;
  Roles: undefined;
  Tags: undefined;
  InterestRates: undefined;
  Notifications: undefined;
};

export type MainTabsParamList = {
  Menu: undefined;
  DailyCollections: undefined;
  NewCredit: NavigatorScreenParams<CreditsTabStackParamList> | undefined;
  Payments: undefined;
  Customers: undefined;
};
