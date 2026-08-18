import './style.css';
import { Country } from './models/Country';
import { fetchCountries } from './services/apiServices';

function normalizeCountries(rawData: unknown): Country[] {
  const items = Array.isArray(rawData) ? rawData : [];

  return items.map((item: any) => {
    const currencies = item.currencies ?? {};
    const currenciesArray = Object.entries(currencies as Record<string, any>).map(([code, details]: [string, any]) => ({
      code,
      name: details?.name || code,
      symbol: details?.symbol || '',
    }));

    const countryName =
      item.names?.common ||
      item.name?.common ||
      item.names?.official ||
      item.name?.official ||
      item.name ||
      'Unknown';

    return new Country(
      {
        name: countryName,
        population: Number(item.population ?? 0),
        region: item.region || 'Unknown',
        capital: Array.isArray(item.capital) ? item.capital[0] : item.capital || 'N/A',
        flagUrl: item.flags?.svg || item.flags?.png || item.flagUrl || '',
        alpha3Code: item.cca3 || item.cca2 || item.alpha3Code || '',
      },
      item.flags,
      currenciesArray
    );
  });
}

function sortCountries(countries: Country[]): Country[] {
  const regionOrder: Record<string, number> = {
    Africa: 1,
    Americas: 2,
    Asia: 3,
    Europe: 4,
    Oceania: 5,
  };

  return [...countries].sort((a, b) => {
    const regionA = a.region || '';
    const regionB = b.region || '';
    const regionDelta = (regionOrder[regionA] ?? 99) - (regionOrder[regionB] ?? 99);

    if (regionDelta !== 0) return regionDelta;
    return a.name.localeCompare(b.name);
  });
}

function renderCountries(countries: Country[]) {
  const grid = document.querySelector('#countries-grid');

  if (!grid) {
    throw new Error('Could not find #countries-grid element');
  }

  const orderedCountries = sortCountries(countries);

  grid.innerHTML = orderedCountries
    .map(
      (country) => `
        <article class="country-card">
          <img class="country-flag" src="${country.flagUrl}" alt="${country.name} flag" />
          <div class="country-info">
            <h2 class="country-name">${country.name}</h2>
            <p><strong>Population:</strong> ${country.formattedPopulation}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Capital:</strong> ${country.capital}</p>
            <p><strong>Currency:</strong> ${country.currencyName}</p>
          </div>
        </article>
      `
    )
    .join('');
}

async function init() {
  try {
    const rawData = await fetchCountries();
    console.log('Loaded countries:', rawData.length);
    console.table(
      rawData.slice(0, 10).map((country: any) => {
        const firstCurrency = Object.values(country.currencies ?? {}) as Array<{ name?: string }>;

        return {
          name: country.names?.common ?? country.name?.common ?? country.name,
          capital: country.capital?.[0] ?? 'N/A',
          region: country.region ?? 'Unknown',
          population: country.population ?? 0,
          currency: firstCurrency[0]?.name ?? 'N/A',
          code: country.cca3 ?? country.cca2 ?? 'N/A',
        };
      })
    );

    const countries = normalizeCountries(rawData);

    if (!countries.length) {
      console.warn('No countries were returned from the API.');
      return;
    }

    renderCountries(countries);
  } catch (error) {
    console.error('Country data initialization failed:', error);
  }
}

init();