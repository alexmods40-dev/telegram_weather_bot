import type { LocationData } from './interfaces/LocationDataInterface.js'

const url = 'https://dataservice.accuweather.com';
const api = process.env.API!;
const options = {method: 'GET', headers: {Authorization: `Bearer ${api}`}};

export async function fetchLocationData(city: string): Promise<LocationData> {
    try {
        const response = await fetch(`${url}/locations/v1/cities/search?q=${city}`, options);
        if(!response.ok) throw new Error(`Response error: ${response.status}`);
        const data = await response.json();
        if (!data || data.length === 0) throw new Error('City not found!');
        const { Key, LocalizedName, EnglishName } = data[0];
        const LocalizedCountyName = data[0].Country.LocalizedName;
        const EnglisCountyName = data[0].Country.EnglishName;
        return {Key, LocalizedName, LocalizedCountyName, EnglishName, EnglisCountyName}
    } catch(e: unknown) {
        console.log((e as Error).message);
        throw new Error("Error when fetching location data!");
    }
}