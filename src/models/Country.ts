// src/models/Country.ts

export class Country {
  name: string;
  population: number;
  region: string;
  capital: string;
  code: string;
  flagUrl: string;
  flagAlt: string;
  currencyName: string;
  currencySymbol: string;

  constructor(data: any = {}) {
    // 1. Country Name: checks v5 (names.common), legacy/fallback (name string or name.common), or root name
    let countryName = '';
    if (typeof data.name === 'string') {
      countryName = data.name;
    } else if (data.names && typeof data.names === 'object') {
      countryName = data.names.common || data.names.official || '';
    } else if (data.name && typeof data.name === 'object') {
      countryName = data.name.common || data.name.official || data.name.name || '';
    }

    if (!countryName) {
      countryName = data.country || data.country_name || 'Unknown';
    }
    this.name = countryName;

    // 2. Population & Region
    this.population = Number(data.population) || 0;
    this.region = typeof data.region === 'string' ? data.region : 'Unknown';

    // 3. Capital
    if (typeof data.capital === 'string') {
      this.capital = data.capital;
    } else if (Array.isArray(data.capital) && data.capital.length > 0) {
      this.capital = typeof data.capital[0] === 'string' ? data.capital[0] : (data.capital[0]?.name || 'N/A');
    } else if (data.capital_city) {
      this.capital = String(data.capital_city);
    } else {
      this.capital = 'N/A';
    }

    // 4. Alpha Codes (v5 codes.alpha_2 / alpha_3 vs data.json alpha2Code / alpha3Code)
    const raw2 =
      data.codes?.alpha_2 ||
      data.codes?.alpha2 ||
      data.alpha2Code ||
      data.cca2 ||
      data.iso2 ||
      '';
    const raw3 =
      data.codes?.alpha_3 ||
      data.codes?.alpha3 ||
      data.alpha3Code ||
      data.cca3 ||
      data.iso3 ||
      '';

    const alpha2 = String(raw2 || '').trim().toLowerCase();
    this.code = String(raw3 || raw2 || data.code || '').toUpperCase();

    // 5. Flag Image
    let flag = '';
    if (data.flags && typeof data.flags === 'object') {
      flag = data.flags.svg || data.flags.png || '';
    } else if (typeof data.flags === 'string' && data.flags.startsWith('http')) {
      flag = data.flags;
    } else if (typeof data.flag === 'string' && data.flag.startsWith('http')) {
      flag = data.flag;
    }

    // Reliable fallback: render FlagCDN using the 2-letter ISO code
    if (!flag && alpha2 && alpha2.length === 2) {
      flag = `https://flagcdn.com/w320/${alpha2}.png`;
    }

    this.flagUrl = flag || 'https://flagcdn.com/w320/un.png';
    this.flagAlt = `Flag of ${this.name}`;

    // 6. Currencies
    if (Array.isArray(data.currencies) && data.currencies.length > 0) {
      const first = data.currencies[0];
      this.currencyName = typeof first === 'object' ? (first.name || 'N/A') : String(first);
      this.currencySymbol = typeof first === 'object' ? (first.symbol || '') : '';
    } else if (data.currencies && typeof data.currencies === 'object') {
      const first = Object.values(data.currencies)[0] as any;
      this.currencyName = first?.name || 'N/A';
      this.currencySymbol = first?.symbol || '';
    } else {
      this.currencyName = 'N/A';
      this.currencySymbol = '';
    }
  }

  get formattedPopulation(): string {
    return this.population.toLocaleString();
  }
}