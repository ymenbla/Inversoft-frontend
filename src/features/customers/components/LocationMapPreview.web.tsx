import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/shared/theme";

type LocationMapPreviewProps = {
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  state: string;
  isInteractive?: boolean;
  onCoordinateChange?: (coordinates: { latitude: number; longitude: number }) => void;
};

const DEFAULT_LATITUDE = 4.5709;
const DEFAULT_LONGITUDE = -74.2973;

function getCoordinate(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getDelta(address: string, city: string, state: string): number {
  if (address.trim()) {
    return 0.01;
  }

  if (city.trim()) {
    return 0.06;
  }

  if (state.trim()) {
    return 0.35;
  }

  return 8;
}

function getZoomLevel(address: string, city: string, state: string): number {
  if (address.trim()) {
    return 16;
  }

  if (city.trim()) {
    return 12;
  }

  if (state.trim()) {
    return 8;
  }

  return 5;
}

function buildEmbedUrl(
  latitude: number,
  longitude: number,
  address: string,
  city: string,
  state: string
): string {
  const delta = getDelta(address, city, state);
  const left = longitude - delta;
  const right = longitude + delta;
  const bottom = latitude - delta;
  const top = latitude + delta;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

function buildOpenMapUrl(
  latitude: number,
  longitude: number,
  address: string,
  city: string,
  state: string
): string {
  const zoom = getZoomLevel(address, city, state);
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`;
}

export function LocationMapPreview({
  latitude,
  longitude,
  address,
  city,
  state,
  isInteractive = true
}: LocationMapPreviewProps): React.JSX.Element {
  const resolvedLatitude = getCoordinate(latitude, DEFAULT_LATITUDE);
  const resolvedLongitude = getCoordinate(longitude, DEFAULT_LONGITUDE);
  const locationLabel = [address.trim(), city.trim(), state.trim()].filter(Boolean).join(", ");

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa de ubicacion</Text>
        <Pressable
          onPress={() =>
            Linking.openURL(
              buildOpenMapUrl(resolvedLatitude, resolvedLongitude, address, city, state)
            )
          }
        >
          <Text style={styles.link}>Abrir mapa</Text>
        </Pressable>
      </View>

      <View style={styles.mapFrame}>
        <iframe
          src={buildEmbedUrl(resolvedLatitude, resolvedLongitude, address, city, state)}
          style={{ width: "100%", height: "100%", border: "0" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de ubicacion del cliente"
        />
      </View>

      <Text style={styles.helper}>
        {locationLabel
          ? isInteractive
            ? `Vista previa para ${locationLabel}. Si cambias latitud o longitud, el mapa se actualiza. En web esta vista no permite seleccionar un punto directamente.`
            : `Vista previa de la ubicacion registrada para ${locationLabel}.`
          : "Vista previa centrada en Colombia. Completa direccion y coordenadas para ubicar mejor al cliente. En web esta vista no permite seleccionar un punto directamente."}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "800"
  },
  link: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: "800"
  },
  mapFrame: {
    height: 240,
    overflow: "hidden",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 20
  }
});
