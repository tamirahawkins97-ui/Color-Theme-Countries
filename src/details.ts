// src/detail.ts

import './style.css';
import { Country } from './models/Country';
import { fetchCountries } from './services/apiServices';

const countryDetailContainer = document.querySelector<HTMLElement>('#country-detail');
const themeToggleBtn = document.querySelector<HTMLButtonElement>('#theme-toggle');
const homeLink = document.querySelector<HTMLElement>('#home-link');

/* --------------------------------------------------------------------------
   THEME TOGGLE
-------------------------------------------------------------------------- */
function setupTheme(): void {
  const themeText = themeToggleBtn?.querySelector<HTMLSpanElement>('.theme-text');
  const themeIcon = themeToggleBtn?.querySelector<HTMLSpanElement>('.theme-icon');

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved === 'dark' || (!saved && prefersDark);

  if (isDark) document.body.classList.add('dark-mode');
  updateBtn(isDark);

  function updateBtn(dark: boolean): void {
    if (themeText) themeText.textContent = dark ? 'Light Mode' : 'Dark Mode';
    if (themeIcon) themeIcon.textContent = dark ? '☀️' : '🌙';
  }

  themeToggleBtn?.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    updateBtn(dark);
  });
}

/* --------------------------------------------------------------------------
   RENDER DETAILS
-------------------------------------------------------------------------- */
function renderDetailView(country: Country, allCountries: Country[]): void {
  if (!countryDetailContainer) return;

  // Resolve borders to buttons with links
  let bordersHtml = '<span>None</span>';

  if (country.borders && country.borders.length > 0) {
    const badges = country.borders
      .map((borderCode: string) => {
        const borderMatch = allCountries.find(
          (c: Country) => c.code.toUpperCase() === borderCode.toUpperCase()
        );
        const name = borderMatch ? borderMatch.name : borderCode;
        return `<a href="/detail.html?code=${borderCode}" class="btn border-badge">${name}</a>`;
      })
      .join('');

    bordersHtml = `<div class="border-badges">${badges}</div>`;
  }

  countryDetailContainer.innerHTML = `
    <div class="detail-flag-wrapper">
      <img src="${country.flagUrl}" alt="${country.flagAlt}" class="detail-flag" />
    </div>

    <div class="detail-info">
      <h2 class="detail-title">${country.name}</h2>

      <div class="detail-columns">
        <div>
          <p><strong>Native Name:</strong> ${country.nativeName}</p>
          <p><strong>Population:</strong> ${country.formattedPopulation}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Sub Region:</strong> ${country.subregion}</p>
          <p><strong>Capital:</strong> ${country.capital}</p>
        </div>

        <div>
          <p><strong>Top Level Domain:</strong> ${country.topLevelDomain}</p>
          <p><strong>Currencies:</strong> ${country.currencyName}${
            country.currencySymbol ? ` (${country.currencySymbol})` : ''
          }</p>
          <p><strong>Languages:</strong> ${country.languages.join(', ')}</p>
        </div>
      </div>

      <div class="border-countries">
        <strong>Border Countries:</strong>
        ${bordersHtml}
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   INIT DETAIL PAGE
-------------------------------------------------------------------------- */
async function init(): Promise<void> {
  setupTheme();

  homeLink?.addEventListener('click', () => {
    window.location.href = '/';
  });

  const params = new URLSearchParams(window.location.search);
  const countryCode = params.get('code');

  if (!countryCode) {
    if (countryDetailContainer) {
      countryDetailContainer.innerHTML = `<p>No country specified. <a href="/">Return home</a></p>`;
    }
    return;
  }

  try {
    const rawData = await fetchCountries();
    const allCountries = rawData.map((item: any) => new Country(item));

    const selectedCountry = allCountries.find(
      (c: Country) => c.code.toUpperCase() === countryCode.toUpperCase()
    );

    if (selectedCountry) {
      document.title = `${selectedCountry.name} - Details`;
      renderDetailView(selectedCountry, allCountries);
    } else {
      if (countryDetailContainer) {
        countryDetailContainer.innerHTML = `<p>Country not found. <a href="/">Return home</a></p>`;
      }
    }
  } catch (err) {
    console.error('Failed to load country details:', err);
  }
}

init();