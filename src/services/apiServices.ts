const BASE_URL = 'https://api.restcountries.com/countries/v5';
const API_TOKEN = 'rc_live_2639ebb835284643ac8501289d37605e';

export async function fetchCountries() {
  try {
    const response = await fetch(`${BASE_URL}?pretty=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status} (${response.statusText})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching country data:', error);
    throw error;
  }
}