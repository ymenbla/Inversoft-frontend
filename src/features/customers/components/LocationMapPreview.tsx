import { Platform } from "react-native";

type LocationMapPreviewProps = {
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  state: string;
  isInteractive?: boolean;
  onCoordinateChange?: (coordinates: { latitude: number; longitude: number }) => void;
};

export function LocationMapPreview(props: LocationMapPreviewProps): React.JSX.Element {
  if (Platform.OS === "web") {
    const { LocationMapPreview: WebLocationMapPreview } = require("@/features/customers/components/LocationMapPreview.web") as typeof import("@/features/customers/components/LocationMapPreview.web");

    return <WebLocationMapPreview {...props} />;
  }

  const { LocationMapPreview: NativeLocationMapPreview } = require("@/features/customers/components/LocationMapPreview.native") as typeof import("@/features/customers/components/LocationMapPreview.native");

  return <NativeLocationMapPreview {...props} onCoordinateChange={props.onCoordinateChange ?? (() => undefined)} />;
}
