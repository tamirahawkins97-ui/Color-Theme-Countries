// src/detail.ts

import './style.css';
import { Country } from './models/Country';
import { fetchCountries } from './services/apiServices';

const countryDetailContainer = document.querySelector<HTMLElement>('#country-detail');
const themeToggleBtn = document.querySelector<HTMLButtonElement>('#theme-toggle');
const homeLink = document.querySelector<HTMLElement>('#home-link');

const THEME_KEY = 'theme-preference';

/* --------------------------------------------------------------------------
   1. THEME TOGGLE
-------------------------------------------------------------------------- */
function setupTheme(): void {
  const themeText = themeToggleBtn?.querySelector<HTMLSpanElement>('.theme-text');
  const themeIcon = themeToggleBtn?.querySelector<HTMLSpanElement>('.theme-icon');

  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved === 'dark' || (!saved && prefersDark);

  if (isDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  updateBtn(isDark);

  function updateBtn(dark: boolean): void {
    if (themeText) themeText.textContent = dark ? 'Light Mode' : 'Dark Mode';
    if (themeIcon) themeIcon.textContent = dark ? '☀️' : '🌙';
  }

  themeToggleBtn?.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark-mode');
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    updateBtn(dark);
  });
}

/* --------------------------------------------------------------------------
   2. RENDER DETAILS
-------------------------------------------------------------------------- */
function renderDetailView(country: Country, allCountries: Country[]): void {
  if (!countryDetailContainer) return;

  let bordersHtml = '<span class="no-borders" style="color: var(--text-muted);">None</span>';

  if (country.borders && country.borders.length > 0) {
    const badges = country.borders
      .map((borderCode: string) => {
        const borderMatch = allCountries.find(
          (c: Country) =>
            (c.code && c.code.toUpperCase() === borderCode.toUpperCase()) ||
            (c.name && c.name.toLowerCase() === borderCode.toLowerCase())
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
        <div class="detail-col">
          <p><strong>Native Name:</strong> <span>${country.nativeName || country.name}</span></p>
          <p><strong>Population:</strong> <span>${country.formattedPopulation}</span></p>
          <p><strong>Region:</strong> <span>${country.region}</span></p>
          <p><strong>Sub Region:</strong> <span>${country.subregion}</span></p>
          <p><strong>Capital:</strong> <span>${country.capital}</span></p>
        </div>

        <div class="detail-col">
          <p><strong>Top Level Domain:</strong> <span>${country.topLevelDomain}</span></p>
          <p><strong>Currencies:</strong> <span>${country.currencyName}${
            country.currencySymbol ? ` (${country.currencySymbol})` : ''
          }</span></p>
          <p><strong>Languages:</strong> <span>${
            country.languages && country.languages.length > 0 ? country.languages.join(', ') : 'N/A'
          }</span></p>
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
   3. INITIALIZE & FETCH
-------------------------------------------------------------------------- */
async function init(): Promise<void> {
  setupTheme();

  homeLink?.addEventListener('click', () => {
    window.location.href = '/';
  });

  const params = new URLSearchParams(window.location.search);
  const targetCode = (params.get('code') || params.get('country'))?.trim();

  console.log('[Detail Page] Extracted URL code:', targetCode);

  if (!targetCode) {
    if (countryDetailContainer) {
      countryDetailContainer.innerHTML = `
        <div style="grid-column: 1 / -1;">
          <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 1.5rem;">No country specified in URL.</p>
          <a href="/" class="btn back-btn">&larr; Back to Home</a>
        </div>
      `;
    }
    return;
  }

  try {
    const rawData = await fetchCountries();
    const allCountries: Country[] = Array.isArray(rawData)
      ? rawData.map((item: any) => new Country(item))
      : [];

    console.log('[Detail Page] Total countries loaded:', allCountries.length);

    const selectedCountry = allCountries.find((c: Country) => {
      const codeMatch = c.code && c.code.toUpperCase() === targetCode.toUpperCase();
      const nameMatch = c.name && c.name.toLowerCase() === targetCode.toLowerCase();
      return codeMatch || nameMatch;
    });

    if (selectedCountry) {
      console.log('[Detail Page] Country found:', selectedCountry.name);
      document.title = `${selectedCountry.name} - Where in the world?`;
      renderDetailView(selectedCountry, allCountries);
    } else {
      console.warn('[Detail Page] No matching country found for:', targetCode);
      if (countryDetailContainer) {
        countryDetailContainer.innerHTML = `
          <div style="grid-column: 1 / -1;">
            <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 1.5rem;">Could not find details for "${targetCode}".</p>
            <a href="/" class="btn back-btn">&larr; Back to Home</a>
          </div>
        `;
      }
    }
  } catch (err) {
    console.error('[Detail Page] Error loading data:', err);
  }
}

init();