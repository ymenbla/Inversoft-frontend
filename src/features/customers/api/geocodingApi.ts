type GeocodingResult = {
  latitude: number;
  longitude: number;
};

type GeocodingParams = {
  address?: string;
  city: string;
  state: string;
  country?: string;
};

type NominatimSearchResult = {
  lat: string;
  lon: string;
};

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";

export async function geocodeCustomerLocation({
  address,
  city,
  state,
  country = "Colombia"
}: GeocodingParams): Promise<GeocodingResult | null> {
  const params = new URLSearchParams({
    city,
    state,
    country,
    countrycodes: "co",
    format: "jsonv2",
    limit: "1",
    addressdetails: "0"
  });

  if (address?.trim()) {
    params.set("street", address.trim());
  }

  const response = await fetch(`${NOMINATIM_SEARCH_URL}?${params.toString()}`, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("No fue posible consultar el servicio de geocodificacion.");
  }

  const results = (await response.json()) as NominatimSearchResult[];
  const firstResult = results[0];

  if (!firstResult) {
    return null;
  }

  const latitude = Number(firstResult.lat);
  const longitude = Number(firstResult.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude
  };
}
