// src/models/Country.ts

export interface ICurrency {
  code?: string;
  name: string;
  symbol?: string;
}

export interface IFlags {
  svg?: string;
  png?: string;
  alt?: string;
}

export interface IRawCountryData {
  name: string | { common: string; official?: string };
  population?: number;
  region?: string;
  capital?: string | string[];
  flags?: IFlags;
  flag?: string;
  alpha2Code?: string;
  cca2?: string;
  alpha3Code?: string;
  cca3?: string;
  currencies?: ICurrency[] | Record<string, { name: string; symbol?: string }>;
}

export class Country {
  name: string;
  population: number;
  region: string;
  capital: string;
  code: string;
  flagSvg: string;
  flagPng: string;
  flagUrl: string;
  flagAlt: string;
  currencyName: string;
  currencySymbol: string;

  constructor(data: IRawCountryData) {
    // 1. Country Name (API v3 object vs v2 string)
    if (typeof data.name === 'object' && data.name !== null) {
      this.name = data.name.common || 'Unknown';
    } else {
      this.name = data.name || 'Unknown';
    }

    // 2. Population & Region
    this.population = data.population ?? 0;
    this.region = data.region || 'Unknown';

    // 3. Capital (array vs string)
    if (Array.isArray(data.capital)) {
      this.capital = data.capital.length > 0 ? data.capital[0] : 'N/A';
    } else {
      this.capital = data.capital || 'N/A';
    }

    // 4. Country Code (3-letter)
    this.code = data.cca3 || data.alpha3Code || '';

    // 5. Flags (Deterministic CDN resolution with fallbacks)
    const alpha2 = (data.cca2 || data.alpha2Code || '').toLowerCase();

    this.flagSvg = data.flags?.svg || (data.flag?.endsWith('.svg') ? data.flag : '');
    this.flagPng = data.flags?.png || (data.flag?.endsWith('.png') ? data.flag : '');

    let selectedFlag = this.flagSvg || this.flagPng || data.flag || '';

    if (selectedFlag.startsWith('//')) {
      selectedFlag = `https:${selectedFlag}`;
    }

    // If no valid flag URL was extracted from data, generate from 2-letter ISO code
    if (!selectedFlag && alpha2) {
      selectedFlag = `https://flagcdn.com/${alpha2}.svg`;
    }

    this.flagUrl = selectedFlag.trim() !== ''
      ? selectedFlag
      : 'https://via.placeholder.com/320x213?text=No+Flag';

    this.flagAlt = data.flags?.alt || `Flag of ${this.name}`;

    // 6. Currencies (Array in data.json vs Dictionary Map in API v3)
    if (Array.isArray(data.currencies) && data.currencies.length > 0) {
      this.currencyName = data.currencies[0].name || 'N/A';
      this.currencySymbol = data.currencies[0].symbol || '';
    } else if (data.currencies && typeof data.currencies === 'object') {
      const currencyList = Object.values(data.currencies) as Array<{ name?: string; symbol?: string }>;
      const firstCurrency = currencyList[0];

      this.currencyName = firstCurrency?.name || 'N/A';
      this.currencySymbol = firstCurrency?.symbol || '';
    } else {
      this.currencyName = 'N/A';
      this.currencySymbol = '';
    }
  }

  get formattedPopulation(): string {
    return this.population.toLocaleString();
  }
}