// src/models/Country.ts

function extractString(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);

  if (Array.isArray(val)) {
    for (const item of val) {
      const res = extractString(item);
      if (res) return res;
    }
    return '';
  }

  if (typeof val === 'object' && val !== null) {
    const directKeys = ['common', 'name', 'official', 'title', 'value', 'capital', 'capital_city'];
    for (const key of directKeys) {
      if (typeof val[key] === 'string' && val[key].trim() !== '') {
        return val[key];
      }
    }
    for (const subVal of Object.values(val)) {
      const res = extractString(subVal);
      if (res) return res;
    }
  }

  return '';
}

export class Country {
  name: string;
  nativeName: string;
  population: number;
  region: string;
  subregion: string;
  capital: string;
  topLevelDomain: string;
  code: string;
  flagUrl: string;
  flagAlt: string;
  currencyName: string;
  currencySymbol: string;
  languages: string[];
  borders: string[];

  constructor(data: any = {}) {
    // 1. Country Name
    let countryName = '';
    if (typeof data.name === 'string') {
      countryName = data.name;
    } else if (data.names && typeof data.names === 'object') {
      countryName = data.names.common || data.names.official || '';
    } else if (data.name && typeof data.name === 'object') {
      countryName = data.name.common || data.name.official || '';
    }
    this.name = countryName || data.country || data.country_name || 'Unknown';

    // 2. Native Name
    if (data.name?.nativeName && typeof data.name.nativeName === 'object') {
      const firstNative = Object.values(data.name.nativeName)[0] as any;
      this.nativeName = firstNative?.common || firstNative?.official || this.name;
    } else {
      this.nativeName = data.nativeName || this.name;
    }

    // 3. Population & Region Stats
    this.population = Number(data.population) || 0;
    this.region = extractString(data.region ?? data.continent) || 'Unknown';
    this.subregion = extractString(data.subregion) || 'N/A';

    // 4. Capital
    const rawCapital = data.capital ?? data.capitals ?? data.capital_city;
    this.capital = extractString(rawCapital) || 'N/A';

    // 5. Domain & Borders
    this.topLevelDomain = Array.isArray(data.topLevelDomain)
      ? data.topLevelDomain[0] || 'N/A'
      : (data.tld?.[0] || 'N/A');

    this.borders = Array.isArray(data.borders) ? (data.borders as string[]) : [];

    // 6. ISO Codes
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

    // 7. Flag Image Resolution
    let flag = '';
    if (data.flags && typeof data.flags === 'object') {
      flag = data.flags.svg || data.flags.png || '';
    } else if (typeof data.flags === 'string' && data.flags.startsWith('http')) {
      flag = data.flags;
    } else if (typeof data.flag === 'string' && data.flag.startsWith('http')) {
      flag = data.flag;
    }

    if (!flag && alpha2 && alpha2.length === 2) {
      flag = `https://flagcdn.com/w320/${alpha2}.png`;
    }

    this.flagUrl = flag || 'https://flagcdn.com/w320/un.png';
    this.flagAlt = `Flag of ${this.name}`;

    // 8. Currencies
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

    // 9. Languages
    if (Array.isArray(data.languages)) {
      this.languages = data.languages.map((l: any) => (typeof l === 'object' ? l.name : String(l)));
    } else if (data.languages && typeof data.languages === 'object') {
      this.languages = Object.values(data.languages) as string[];
    } else {
      this.languages = ['N/A'];
    }
  }

  get formattedPopulation(): string {
    return this.population.toLocaleString();
  }
}