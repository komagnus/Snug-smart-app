import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.met.no', // Replace with your common API base URL
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

export async function getWeatherForecastByArea(lat: number, lon: number): Promise<any> {
  try {
    const response = await axiosInstance.get(`/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error; 
  }
}