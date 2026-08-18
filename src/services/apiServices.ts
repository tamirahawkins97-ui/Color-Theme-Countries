const BASE_URL = 'https://api.restcountries.com/countries/v5?pretty=1';
const API_TOKEN = 'rc_live_2639ebb835284643ac8501289d37605e';

function unwrapCountriesPayload(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.objects)) return payload.objects;
  if (Array.isArray(payload?.data?.objects)) return payload.data.objects;
  if (Array.isArray(payload?.countries)) return payload.countries;
  return [];
}

export async function fetchCountries() {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status} (${response.statusText})`);
    }

    const data = await response.json();
    return unwrapCountriesPayload(data);
  } catch (error) {
    console.error('API request failed, falling back to local data:', error);

    const localResponse = await fetch('/data.json');

    if (!localResponse.ok) {
      throw new Error(`Failed to load local data.json. Status: ${localResponse.status}`);
    }

    const fallbackData = await localResponse.json();
    return unwrapCountriesPayload(fallbackData);
  }
}
