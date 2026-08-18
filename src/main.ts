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

/* --------------------------------------------------------------------------
   1. THEME TOGGLE
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
   2. RENDER HOME GRID WITH LINKS
-------------------------------------------------------------------------- */
function renderCountries(countries: Country[]): void {
  if (!countriesGrid) return;

  if (countries.length === 0) {
    countriesGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">No matching countries found.</p>`;
    return;
  }

  countriesGrid.innerHTML = countries
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
              <p><strong>Population:</strong> ${country.formattedPopulation}</p>
              <p><strong>Region:</strong> ${country.region}</p>
              <p><strong>Capital:</strong> ${country.capital}</p>
            </div>
          </article>
        </a>
      `
    )
    .join('');
}

/* --------------------------------------------------------------------------
   3. SEARCH & FILTER
-------------------------------------------------------------------------- */
function handleSearchAndFilter(): void {
  const query = searchInput?.value.trim().toLowerCase() || '';
  const selectedRegion = regionFilter?.value.trim().toLowerCase() || '';

  const filtered = allCountries.filter((country: Country) => {
    const matchesSearch = country.name.toLowerCase().includes(query);
    const matchesRegion = !selectedRegion || country.region.toLowerCase() === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  renderCountries(filtered);
}

/* --------------------------------------------------------------------------
   4. INIT
-------------------------------------------------------------------------- */
async function init(): Promise<void> {
  setupTheme();

  searchInput?.addEventListener('input', handleSearchAndFilter);
  regionFilter?.addEventListener('change', handleSearchAndFilter);

  try {
    const rawData = await fetchCountries();
    allCountries = Array.isArray(rawData)
      ? rawData.map((item: any) => new Country(item))
      : [];

    renderCountries(allCountries);
  } catch (error) {
    console.error('Country data initialization failed:', error);
  }
}

init();