import type { LocationData } from './interfaces/LocationDataInterface.js'

const url = 'https://dataservice.accuweather.com';
const api = process.env.API!;
const options = {method: 'GET', headers: {Authorization: `Bearer ${api}`}};

export async function fetchLocationDataByGeo(latitude: number, longitude: number): Promise<LocationData> {
    try {
        const response = await fetch(`${url}/locations/v1/cities/geoposition/search?q=${latitude}, ${longitude}`, options);
        if(!response.ok) throw new Error(`Response error: ${response.status}`);
        const data = await response.json();
        if(!data) throw new Error('Data not found!');
        const { Key, LocalizedName, EnglishName } = data;
        const LocalizedCountyName = data.Country.LocalizedName;
        const EnglisCountyName = data.Country.EnglishName;
        return {Key, LocalizedName, LocalizedCountyName, EnglishName, EnglisCountyName}
    } catch(e: unknown) {
        console.log((e as Error).message);
        throw new Error("Error when fetching location data!");
    }
}