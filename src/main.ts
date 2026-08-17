import { Country } from './models/Country';
import { fetchCountries } from './services/apiServices';

async function init() {
  try {
    const rawData = await fetchCountries();
    console.log('Raw Payload from API:', rawData);

    // Map each raw object to an instantiated Country class
    const countryInstances: Country[] = rawData.map((item: any) => new Country(
      {
        name: item.name,
        population: item.population,
        region: item.region,
        capital: item.capital,
        flagUrl: item.flags?.svg || item.flags?.png,
        alpha3Code: item.alpha3Code || item.cca3
      },
      item.flags,
      item.currencies
    ));

    console.log('Mapped Country Class Instances:', countryInstances);
  } catch (error) {
    console.error('Initialization failed:', error);
  }
}

init();