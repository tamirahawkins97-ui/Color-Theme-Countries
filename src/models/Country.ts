// Sub-types for nested properties
export interface ICurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface IFlags {
  svg: string;
  png: string;
}

export interface ICountryCard {
  name: string;
  population: number;
  region: string;
  capital?: string;
  flagUrl: string;
  alpha3Code: string;
}

export class Country {
  name: string;
  population: number;
  region: string;
  capital: string;
  flagUrl: string;
  code: string;
  currencyName: string;
  currencySymbol: string;

  constructor(
    data: ICountryCard,
    flags?: IFlags,
    currencies?: ICurrency[]
  ) {
    this.name = data.name;
    this.population = data.population ?? 0;
    this.region = data.region || 'Unknown';
    this.capital = data.capital || 'N/A';
    this.code = data.alpha3Code || '';

    // Extract flag from either parameter or fallback 
    this.flagUrl = flags?.svg || flags?.png || data.flagUrl || '';

    // Extract primary currency safely from the currencies array parameter
    this.currencyName = currencies?.[0]?.name || 'N/A';
    this.currencySymbol = currencies?.[0]?.symbol || '';
  }

  // Handy getter to format population with commas
  get formattedPopulation(): string {
    return this.population.toLocaleString();
  }
}
