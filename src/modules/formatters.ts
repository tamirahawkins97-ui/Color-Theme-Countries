// src/utils/formatter.ts (or your formatter module)

import { Country } from '../models/Country';

export function renderCountries(countries: Country[]): void {
  // Query right when we are ready to paint the DOM:
  const grid = document.querySelector('#countries-grid');

  if (!grid) {
    console.warn('Could not find #countries-grid element in the DOM.');
    return;
  }

  grid.innerHTML = countries
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