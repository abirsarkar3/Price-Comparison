// lib/getLocationDetailsFromCoords.ts
export interface LocationDetails {
  city: string;
  state: string;
  country: string;
  fullAddress: string;
  pincode?: string;
}

export async function getLocationDetailsFromCoords(
  latitude: number,
  longitude: number
): Promise<LocationDetails | null> {
  try {
    // Try OpenStreetMap Nominatim first (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'PriceComparisonPlatform/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Nominatim request failed');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    const address = data.address;
    
    // Extract location details
    const city = address.city || 
                 address.town || 
                 address.village || 
                 address.county || 
                 address.state || 
                 'Unknown City';
    
    const state = address.state || 'Unknown State';
    const country = address.country || 'Unknown Country';
    const pincode = address.postcode || undefined;
    
    // Build full address
    const fullAddress = [
      address.house_number,
      address.road,
      address.suburb,
      city,
      state,
      pincode,
      country
    ].filter(Boolean).join(', ');

    return {
      city,
      state,
      country,
      fullAddress,
      pincode
    };
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    
    // Fallback: return coordinates as city name
    return {
      city: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      state: 'Location',
      country: 'Unknown',
      fullAddress: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      pincode: undefined
    };
  }
}

// Alternative function using Google Maps Geocoding API (requires API key)
export async function getLocationDetailsFromCoordsGoogle(
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<LocationDetails | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Google Geocoding request failed');
    }

    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results[0]) {
      throw new Error(`Google Geocoding error: ${data.status}`);
    }

    const result = data.results[0];
    const addressComponents = result.address_components;
    
    let city = '';
    let state = '';
    let country = '';
    let pincode = '';

    for (const component of addressComponents) {
      const types = component.types;
      
      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      } else if (types.includes('postal_code')) {
        pincode = component.long_name;
      }
    }

    return {
      city: city || 'Unknown City',
      state: state || 'Unknown State',
      country: country || 'Unknown Country',
      fullAddress: result.formatted_address,
      pincode: pincode || undefined
    };
  } catch (error) {
    console.warn('Google reverse geocoding failed:', error);
    return null;
  }
}
