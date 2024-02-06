import axios, { AxiosInstance } from 'axios';
import { ref } from 'vue';

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
const dbConnectionURl = 'http://localhost:5038/'

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
export interface DeviceInfo {
  id: string,
  deviceType: string,
  sensors: {
      radonShortTermAvg: string,
      temp: string,
      humidity: string,
      pressure: string,
      co2: string,
      voc: string,
      pm1: string,
      pm25: string,
      staleAir: string,
      transmissionEfficiency: string,
      virusSurvivalRate: string,
      virusRisk: string,
  },
  segment: {
      id: string,
      name: string,
      started: string,
      active: boolean,
  },
  location: {
      id: string,
      name: string,
  },
  productName: string,
}
export interface LocationInfo {
  id: string,
  name: string,
  labels: Record<string, any>,
  devices: {
    id: string,
    deviceType: string,
    segment: {
        id: string,
        name: string,
        started: string,
        active: boolean,
    },
    productName: string,
  },
  lat: number,
  lng: number,
  usageHours: Record<string, any>,
}
export interface UserInfo {
  userid: string,
  username: string,
  userpw: string
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

export async function getDeviceData(serialNumber: string, accessToken: string): Promise<DataOnDevice> {
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
export async function getDeviceInfo(serialNumber: string, accessToken: string): Promise<DeviceInfo> {
  const deviceAxiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://ext-api.airthings.com/v1/devices/',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  try {
    const response = await deviceAxiosInstance.get(`${serialNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device data:', error);
    throw error; 
  }
}
export async function getLocationInfo(locationID: string, accessToken: string): Promise<LocationInfo> {
  const deviceAxiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://ext-api.airthings.com/v1/locations/',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  try {
    const response = await deviceAxiosInstance.get(`${locationID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device data:', error);
    throw error; 
  }
}

export async function getDataFromDB () {
  const docs = ref([])
  try {
    axios.get(dbConnectionURl + "db/snugeusmartapp/getDeviceInfo").then(
      (response)=> {
        docs.value=response.data;
      }
    )
    return docs;
  } catch(e) {
    console.log(e)
    throw e;
  }
}
export async function getUserFromDB() {
  try {
    const userinfo = axios.get(dbConnectionURl + "db/snugeusmartapp/getUser")
    return userinfo;
  } catch(e) {
    console.log(e)
    throw e;
  }
}
export async function addUserToDB (userName: string, userPw: string) {
  const body = {
    username: userName,
    userpw: userPw
  }
  try {
    axios.post(dbConnectionURl + "db/snugeusmartapp/addUser", body).then(
      (response)=> {
        getUserFromDB();
      }
    )
  } catch(e) {
    console.log(e)
    throw e;
  }
}
export async function addDeviceToDB (clientID: string, clientSecret: string, serialNumber: string) {
  const body = {
    clientid: clientID,
    clientsecret: clientSecret,
    serialnumber: serialNumber
  }
  try {
    axios.post(dbConnectionURl + "db/snugeusmartapp/addDevice", body).then(
      (response)=> {
        getDataFromDB();
      }
    )
  } catch(e) {
    console.log(e)
    throw e;
  }
}