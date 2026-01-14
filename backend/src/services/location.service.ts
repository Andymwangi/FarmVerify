import axios from "axios";

const HEIGIT_API_KEY = process.env.HEIGIT_API_KEY;
const HEIGIT_BASE_URL = "https://api.openrouteservice.org";

interface ReverseGeocodeResponse {
  features: Array<{
    properties: {
      label: string;
      country: string;
      region?: string;
      locality?: string;
    };
  }>;
}

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await axios.get<ReverseGeocodeResponse>(
      `${HEIGIT_BASE_URL}/geocode/reverse`,
      {
        params: {
          api_key: HEIGIT_API_KEY,
          point: `${longitude},${latitude}`,
          size: 1,
        },
      }
    );

    if (response.data.features && response.data.features.length > 0) {
      return response.data.features[0].properties.label;
    }

    return "Location address not found";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Unable to fetch address";
  }
};

export const validateCoordinates = (
  latitude: number,
  longitude: number
): boolean => {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};
