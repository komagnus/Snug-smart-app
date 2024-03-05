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
const weatherLinkAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.weatherlink.com/v2/',
  headers: {
    'Content-Type': 'application/json',
  },
});
const dbURl = 'https://snug-smart-app-backend.onrender.com'

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
export async function getWeatherLinkData(stationId: string, apisecret: string, apikey: string) {
  try {
    const response = await axios.get(`https://snug-smart-app-backend.onrender.com/weatherlink/${stationId}?apiKey=${apikey}&apiSecret=${apisecret}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device data:', error);
    throw error;
  }
}
export async function getUserFromDB(userName: string) {
  try {
    const response = await axios.get(dbURl + '/getUser/' + userName);
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}
export async function getDeviceFromDB(userId: string) {
  const collection = "devicedatacollection"
  try {
    const response = await axios.get(dbURl + '/getInfo/' + userId + '?collection=' + collection);
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function getWeatherStationFromDB(userId: string) {
    const collection = "weatherlinkcollection"
    try {
      const response = await axios.get(dbURl + '/getInfo/' + userId + '?collection=' + collection);
      return response.data
    }catch (error) {
    console.error('Error:', error);
  }
}

export async function getLimitsFromDB(userId: string) {
  const collection = "userlimitscollection"
  try {
    const response = await axios.get(dbURl + '/getInfo/' + userId + '?collection=' + collection);
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function addUserToDB(userName: string, passWord: string) {
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "userdatacollection",
    document: {
      username: userName,
      userpw: passWord
    }
  };
  try {
    const response = await axios.post(dbURl + '/addDocument', data);
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function addDeviceToDB(userId: string, clientId: string, clientSecret: string, serialNumber: string, lat: number, lng: number) {
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
  try {
    const response = await axios.post(dbURl + '/addDocument', data);
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function addWeatherStationToDB(userId: string, stationId: string, apisecret: string, apikey: string) {
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "weatherlinkcollection",
    document: {
      userid: userId,
      wlstationid: stationId,
      wlapisecret: apisecret,
      wlapikey: apikey,
    }
  };
  try {
    const response = await axios.post(dbURl + '/addDocument', data);
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function addLimitsToDB(userId: string, pricelimit: number) {
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "weatherlinkcollection",
    document: {
      userid: userId,
      pricelimit: pricelimit,
    }
  };
  try {
    const response = await axios.post(dbURl + '/addDocument', data);
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function editDeviceInDB(userId: string, clientId: string, clientSecret: string, serialNumber: string, lat: number, lng: number) {
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "devicedatacollection",
    filter: { userid: userId },
    update: {
      $set: {
        clientid: clientId,
        clientsecret: clientSecret,
        serialnumber: serialNumber,
        lat: lat,
        lng: lng
      }
    }
  };
  try {
    const response = await axios.post(dbURl + '/addDocument', data);
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}
export async function editUserInDB(userId: string, userName: string, userPw: string) {
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "devicedatacollection",
    filter: { userid: userId },
    update: {
      $set: {
        username: userName,
        userpw: userPw
      }
    }
  };
  try {
    const response = await axios.post(dbURl + '/addDocument', data);
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function editLimitsInDB(userId: string, PriceLimit: number) {
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "userlimitscollection",
    filter: { userid: userId },
    update: {
      $set: {
        pricelimit: PriceLimit,
      }
    }
  };
  try {
    const response = await axios.post(dbURl + '/addDocument', data);
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}


