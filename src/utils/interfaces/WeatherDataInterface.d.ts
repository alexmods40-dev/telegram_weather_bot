export interface WeatherData {
    date: Date;
    temp: Temp;
    day: Day;
    night: Night;
}

interface TempMin {
    Value: number;
    Unit: string;
    UnitType: number;
}

interface TempMax {
    Value: number;
    Unit: string;
    UnitType: number;
}

interface Temp {
    Minimum: TempMin;
    Maximum: TempMax;
}

interface Day {
    Icon: number;
    IconPhrase: string;
    HasPrecipitation: boolean;
}

interface Night {
    Icon: number;
    IconPhrase: string;
    HasPrecipitation: boolean;
}