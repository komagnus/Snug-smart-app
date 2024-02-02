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
const accountAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://accounts-api.airthings.com/v1/token',
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
    NOK_per_kWh: number,
    EUR_per_kWh: number,
    EXR: number,
    time_start: String,
    time_end: String,
}
export interface DataOnDevice {
  data: {
    time: number,
    battery: number,
    co2: number,
    humidity: number,
    pm1: number,
    pm25: number,
    pressure: number,
    radonShortTermAvg: number,
    relayDeviceType: string,
    rssi: number,
    temp: number,
    voc: number
  }
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

export async function getCurrentPowerPrice(year: string, month: string, day: string, priceArea: string): Promise<PowerPriceSeries[]> {
  try {
    const response = await powerPriceAxiosInstance.get(`/${year}/${month}-${day}_${priceArea}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching power price data:', error);
    throw error; 
  }
}

export async function createAccountToken(clientID: string, clientSecret: string) {
  const requestBody = {
  grant_type: 'client_credentials',
  client_id: clientID,
  client_secret: clientSecret,
  code: "auth-code-from-authorize"
  }
  try {
    const response = await accountAxiosInstance.post('', requestBody);
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function getDeviceInfo(serialNumber: string, accessToken: string): Promise<DataOnDevice> {
  const deviceAxiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://ext-api.airthings.com/v1/devices/',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  
  try {
    const response = await deviceAxiosInstance.get(`${serialNumber}/latest-samples`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device data:', error);
    throw error; 
  }
}