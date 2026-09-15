import type { WeatherData } from './interfaces/WeatherDataInterface.js'

const url = 'https://dataservice.accuweather.com';
const api = process.env.API!;
const options = {method: 'GET', headers: {Authorization: `Bearer ${api}`}};

export async function fetchWeatherData(locationKey: string): Promise<WeatherData> {
    try {
        const response = await fetch(`${url}/forecasts/v1/daily/1day/${locationKey}?metric=true`, options);
        if(!response.ok) throw new Error(`Response error: ${response.status}`);
        const data = await response.json();
        if(!data) throw new Error('Data not found!');
        const date = data.DailyForecasts[0].Date;
        const temp = data.DailyForecasts[0].Temperature;
        const day = data.DailyForecasts[0].Day;
        const night = data.DailyForecasts[0].Night;
        return {date, temp, day, night}
    } catch(e: unknown) {
        console.log((e as Error).message);
        throw new Error("Error when fetching data!");
    }
}

