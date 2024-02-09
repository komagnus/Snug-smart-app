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
const dbAccountAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://realm.mongodb.com/api/client/v2.0/app/data-fxwjv/auth/providers/local-userpass/login',
  headers: {
    'Content-Type': 'application/json',
  },
});
const dbURl = 'https://eu-central-1.aws.data.mongodb-api.com/app/data-fxwjv/endpoint/data/v1'
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
  _id: string,
  name: string,
  username: string,
  userpw: string
}
export interface DbDeviceInfo {
  userid: string,
  clientid: string,
  clientsecret: string,
  serialnumber: string,
  lat: number,
  lng: number
}
export interface TokenResponse {
  access_token: string,
  refresh_token: string,
  user_id: string,
  device_id: string
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
export async function getWeatherLinkData(stationId: string) {
  const deviceAxiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://api.weatherlink.com/v2/',
    headers: {
      secret: `INSERT SECRET HERE`
    }
  });
  try {
    const response = await deviceAxiosInstance.get(`${stationId}& INSERT APIKEY HERE`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device data:', error);
    throw error; 
  }
}
export async function createDbAccountToken() {
  const requestBody = {
    username: 'admin',
    password: 'qo4atxzj3i3AMQQU'
  }
  try {
    const response = await dbAccountAxiosInstance.post('', requestBody);
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function getUserFromDB(userName: string, access_token: string) {
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "userdatacollection",
    filter: {"username": userName}
  };

  const headers = {
    Authorization: `Bearer ${access_token}`,
    Accept: 'application/json'
  }

  try {
    const response = await axios.post(dbURl + '/action/findOne', data, { headers });
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}
export async function getDeviceFromDB(userId: string, access_token: string) {
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "devicedatacollection",
    filter: {
      userid: userId
    }
  };

  const headers = {
    Authorization: `Bearer ${access_token}`,
    Accept: 'application/json'
  };

  try {
    const response = await axios.post(dbURl + '/action/findOne', data, { headers });
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function addUserToDB(accessToken: string, userName: string, passWord: string ) {
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "userdatacollection",
    document: {
      username: userName,
      userpw: passWord
    }
  };

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json'
  };

  try {
    const response = await axios.post(dbURl + '/action/insertOne', data, { headers });
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}
export async function addDeviceToDB(accessToken: string, userId: string, clientId: string, clientSecret: string, serialNumber: string, lat:number, lng: number ) {
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "devicedatacollection",
    document: {
      userid: userId,
      clientid: clientId,
      clientsecret: clientSecret,
      serialnumber: serialNumber,
      lat: lat,
      lng: lng
    }
  };

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json'
  };

  try {
    const response = await axios.post(dbURl + '/action/insertOne', data, { headers });
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}

