// src/main.ts

import './style.css';
import { Country } from './models/Country';
import { fetchCountries } from './services/apiServices';

let allCountries: Country[] = [];

// DOM Elements
const countriesGrid = document.querySelector<HTMLElement>('#countries-grid');
const searchInput = document.querySelector<HTMLInputElement>('#search-input');
const regionFilter = document.querySelector<HTMLSelectElement>('#region-filter');
const themeToggleBtn = document.querySelector<HTMLButtonElement>('#theme-toggle');

const THEME_KEY = 'theme-preference';

/* --------------------------------------------------------------------------
   THEME SETUP
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
    console.log(`[Theme] Toggled to ${dark ? 'dark' : 'light'} mode`);
    updateBtn(dark);
  });
}

/* --------------------------------------------------------------------------
   SORT & RENDER
-------------------------------------------------------------------------- */
function sortCountries(countries: Country[]): Country[] {
  const regionOrder: Record<string, number> = {
    Africa: 1,
    Americas: 2,
    Asia: 3,
    Europe: 4,
    Oceania: 5,
  };

  return [...countries].sort((a: Country, b: Country) => {
    const regionA = a.region || '';
    const regionB = b.region || '';
    const regionDelta = (regionOrder[regionA] ?? 99) - (regionOrder[regionB] ?? 99);

    if (regionDelta !== 0) return regionDelta;
    return a.name.localeCompare(b.name);
  });
}

function renderCountries(countries: Country[]): void {
  if (!countriesGrid) return;

  if (countries.length === 0) {
    countriesGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); font-size: 1.1rem; padding: 2rem 0;">No matching countries found.</p>`;
    return;
  }

  const orderedCountries = sortCountries(countries);

  countriesGrid.innerHTML = orderedCountries
    .map(
      (country: Country) => `
        <a href="/detail.html?code=${country.code}" class="country-card-link">
          <article class="country-card" data-code="${country.code}">
            <div class="flag-wrapper">
              <img 
                class="country-flag" 
                src="${country.flagUrl}" 
                alt="${country.flagAlt}" 
                loading="lazy" 
              />
            </div>
            <div class="country-info">
              <h2 class="country-name">${country.name}</h2>
              <p><strong>Population:</strong> <span>${country.formattedPopulation}</span></p>
              <p><strong>Region:</strong> <span>${country.region}</span></p>
              <p><strong>Capital:</strong> <span>${country.capital}</span></p>
            </div>
          </article>
        </a>
      `
    )
    .join('');
}

/* --------------------------------------------------------------------------
   SEARCH & FILTER
-------------------------------------------------------------------------- */
function handleSearchAndFilter(): void {
  const query = searchInput?.value.trim().toLowerCase() || '';
  const selectedRegion = regionFilter?.value.trim().toLowerCase() || '';

  const filtered = allCountries.filter((country: Country) => {
    const matchesSearch = country.name.toLowerCase().includes(query);
    const isAllRegions = !selectedRegion || selectedRegion === 'all' || selectedRegion === 'filter by region';
    const matchesRegion = isAllRegions || country.region.toLowerCase() === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  console.log(`[Filter] Query: "${query}" | Region: "${selectedRegion}" | Matches: ${filtered.length}`);
  renderCountries(filtered);
}

/* --------------------------------------------------------------------------
   INITIALIZATION
-------------------------------------------------------------------------- */
async function init(): Promise<void> {
  setupTheme();

  searchInput?.addEventListener('input', handleSearchAndFilter);
  regionFilter?.addEventListener('change', handleSearchAndFilter);

  try {
    console.log('[App] Fetching countries data...');
    const rawData = await fetchCountries();
    
    console.log('[App] Loaded raw countries count:', Array.isArray(rawData) ? rawData.length : 0);
    if (Array.isArray(rawData) && rawData.length > 0) {
      console.log('[App] Sample raw record:', rawData[0]);
    }

    allCountries = Array.isArray(rawData)
      ? rawData.map((item: any) => new Country(item))
      : [];

    if (!allCountries.length) {
      console.warn('[App] No country models could be parsed.');
      return;
    }

    console.log('[App] Country instances parsed:', allCountries.length);
    renderCountries(allCountries);
  } catch (error) {
    console.error('[App] Initialization error:', error);
  }
}

init();