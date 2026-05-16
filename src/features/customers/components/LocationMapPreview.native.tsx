import MapView, { Marker, MapPressEvent, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/shared/theme";

type LocationMapPreviewProps = {
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  state: string;
  isInteractive?: boolean;
  onCoordinateChange: (coordinates: { latitude: number; longitude: number }) => void;
};

const DEFAULT_REGION: Region = {
  latitude: 4.5709,
  longitude: -74.2973,
  latitudeDelta: 8,
  longitudeDelta: 8
};

function getRegion(
  latitude: string,
  longitude: string,
  address: string,
  city: string,
  state: string
): Region {
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
    return DEFAULT_REGION;
  }

  const hasAddress = Boolean(address.trim());
  const hasCity = Boolean(city.trim());
  const hasState = Boolean(state.trim());

  const latitudeDelta = hasAddress ? 0.01 : hasCity ? 0.06 : hasState ? 0.35 : 8;
  const longitudeDelta = hasAddress ? 0.01 : hasCity ? 0.06 : hasState ? 0.35 : 8;

  return {
    latitude: parsedLatitude,
    longitude: parsedLongitude,
    latitudeDelta,
    longitudeDelta
  };
}

export function LocationMapPreview({
  latitude,
  longitude,
  address,
  city,
  state,
  isInteractive = true,
  onCoordinateChange
}: LocationMapPreviewProps): React.JSX.Element {
  const region = getRegion(latitude, longitude, address, city, state);
  const hasMarker = Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude));
  const locationLabel = [address.trim(), city.trim(), state.trim()].filter(Boolean).join(", ");

  const handlePress = (event: MapPressEvent) => {
    onCoordinateChange(event.nativeEvent.coordinate);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Mapa de ubicacion</Text>

      <View style={styles.mapFrame}>
        <MapView
          initialRegion={region}
          provider={PROVIDER_GOOGLE}
          region={region}
          style={styles.map}
          onPress={isInteractive ? handlePress : undefined}
        >
          {hasMarker ? (
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude
              }}
              draggable={isInteractive}
              onDragEnd={
                isInteractive
                  ? (event) => onCoordinateChange(event.nativeEvent.coordinate)
                  : undefined
              }
            />
          ) : null}
        </MapView>
      </View>

      <Text style={styles.helper}>
        {locationLabel
          ? isInteractive
            ? `Ubicacion para ${locationLabel}. Toca el mapa o arrastra el marcador para ajustar latitud y longitud.`
            : `Ubicacion registrada para ${locationLabel}.`
          : "Toca el mapa para definir latitud y longitud del cliente."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },
  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "800"
  },
  mapFrame: {
    height: 240,
    overflow: "hidden",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  map: {
    width: "100%",
    height: "100%"
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 20
  }
});
