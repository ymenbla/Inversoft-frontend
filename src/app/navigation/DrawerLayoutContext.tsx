import { createContext, useContext } from "react";

type DrawerLayoutContextValue = {
  isDesktopViewport: boolean;
  isDrawerCollapsed: boolean;
  toggleDesktopDrawer: () => void;
};

const DrawerLayoutContext = createContext<DrawerLayoutContextValue | null>(null);

export function DrawerLayoutProvider({
  children,
  value
}: {
  children: React.ReactNode;
  value: DrawerLayoutContextValue;
}): React.JSX.Element {
  return (
    <DrawerLayoutContext.Provider value={value}>{children}</DrawerLayoutContext.Provider>
  );
}

export function useDrawerLayout(): DrawerLayoutContextValue | null {
  return useContext(DrawerLayoutContext);
}
