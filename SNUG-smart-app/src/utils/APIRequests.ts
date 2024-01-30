import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.met.no',
  headers: {
    'Content-Type': 'application/json',
  },
});
const powerPriceAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://www.hvakosterstrommen.no/api/v1/prices/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TimeSeries {
    time: string; 
    data: {
      instant: {
        details: {
          air_temperature: number;
          relative_humidity: number;
        };
      };
    };
  }
  export interface PowerPriceSeries {
    NOK_per_kWh: string,
    EUR_per_kWh: string,
    EXR: number,
    time_start: String,
    time_end: String,
  }

export async function getWeatherForecastByArea(lat: number, lon: number): Promise<any> {
  try {
    const response = await axiosInstance.get(`/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error; 
  }
}

export async function getCurrentPowerPrice(year: string, month: string, day: string, priceArea: string): Promise<any> {
  try {
    const response = await powerPriceAxiosInstance.get(`/${year}/${month}-${day}_${priceArea}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching power price data:', error);
    throw error; 
  }
}