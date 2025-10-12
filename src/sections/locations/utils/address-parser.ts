/**
 * Utilities for parsing Google Places API address components
 */

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

/**
 * Extract address component by type
 */
export const getAddressComponent = (
  addressComponents: AddressComponent[],
  type: string,
  useLongName = false
): string => {
  const component = addressComponents.find((comp) => comp.types.includes(type));
  if (!component) return '';

  const value = useLongName ? component.long_name : component.short_name;
  return typeof value === 'string' ? value : '';
};

/**
 * Build normalized address from all available components
 */
export const buildNormalizedAddress = (
  addressComponents: AddressComponent[]
): string => {
  const streetNumber = getAddressComponent(addressComponents, 'street_number', true);
  const streetName = getAddressComponent(addressComponents, 'route', true);
  const neighborhood = getAddressComponent(addressComponents, 'neighborhood', true);
  const sublocality = getAddressComponent(addressComponents, 'sublocality_level_1', true);
  const locality = getAddressComponent(addressComponents, 'locality', true);
  const county = getAddressComponent(addressComponents, 'administrative_area_level_2', true);
  const state = getAddressComponent(addressComponents, 'administrative_area_level_1', true);
  const country = getAddressComponent(addressComponents, 'country', true);
  const postalCode = getAddressComponent(addressComponents, 'postal_code', true);

  const parts = [];
  
  // Street address
  if (streetNumber && streetName) {
    parts.push(`${streetNumber} ${streetName}`);
  } else if (streetName) {
    parts.push(streetName);
  }
  
  // Area details
  if (neighborhood) parts.push(neighborhood);
  if (sublocality) parts.push(sublocality);
  if (locality) parts.push(locality);
  if (county) parts.push(county);
  if (state) parts.push(state);
  if (country) parts.push(country);
  if (postalCode) parts.push(postalCode);

  return parts.join(', ');
};

/**
 * Extract individual location fields for database storage
 */
export const extractLocationFields = (
  addressComponents: AddressComponent[]
) => {
  return {
    countryCode: getAddressComponent(addressComponents, 'country').toUpperCase(),
    state: getAddressComponent(addressComponents, 'administrative_area_level_1'),
    district: getAddressComponent(addressComponents, 'locality') || 
              getAddressComponent(addressComponents, 'administrative_area_level_2'),
    municipality: getAddressComponent(addressComponents, 'sublocality_level_1') || 
                  getAddressComponent(addressComponents, 'administrative_area_level_3'),
    postalCode: getAddressComponent(addressComponents, 'postal_code', true),
  };
};