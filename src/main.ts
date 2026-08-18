// src/main.ts

import './style.css';
import { Country } from './models/Country';
import { fetchCountries } from './services/apiServices';

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

function renderCountries(countries: Country[]): void {
  const grid = document.querySelector<HTMLElement>('#countries-grid');

  if (!grid) {
    console.warn('Could not find #countries-grid element in DOM.');
    return;
  }

  const orderedCountries = sortCountries(countries);

  grid.innerHTML = orderedCountries
    .map(
      (country) => `
        <article class="country-card" data-code="${country.code}">
          <div class="flag-wrapper">
            <img 
              class="country-flag" 
              src="${country.flagUrl}" 
              alt="Flag of ${country.name}" 
              loading="lazy" 
            />
          </div>
          <div class="country-info">
            <h2 class="country-name">${country.name}</h2>
            <p><strong>Population:</strong> ${country.formattedPopulation}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Capital:</strong> ${country.capital}</p>
            <p><strong>Currency:</strong> ${country.currencyName}${
              country.currencySymbol ? ` (${country.currencySymbol})` : ''
            }</p>
          </div>
        </article>
      `
    )
    .join('');
}

async function init(): Promise<void> {
  try {
    const rawData = await fetchCountries();
    console.log('Loaded countries count:', Array.isArray(rawData) ? rawData.length : 0);

    if (Array.isArray(rawData) && rawData.length > 0) {
      console.log('SAMPLE_COUNTRY_RAW:', JSON.stringify(rawData[0], null, 2));
    }

    const countries: Country[] = Array.isArray(rawData)
      ? rawData.map((item: any) => new Country(item))
      : [];

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