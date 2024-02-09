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
const dbURl = 'https://eu-central-1.aws.data.mongodb-api.com/app/data-fxwjv/endpoint/data/v1/'
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
export async function getDeviceFromDB(): Promise<DbDeviceInfo[]>{
  try {
    const deviceInfo = await axios.get(dbConnectionURl + "db/snugeusmartapp/getDeviceInfo")
    return deviceInfo.data;
  } catch(e) {
    console.log(e)
    throw e;
  }
}
export async function getUserFromDB(): Promise<UserInfo[]> {
  try {
    const userinfo = await axios.get(dbConnectionURl + "db/snugeusmartapp/getUser")
    return userinfo.data;
  } catch(e) {
    console.log(e)
    throw e;
  }
}
export async function addUserToDB (name: string,userName: string, userPw: string) {
  const body = {
    name: name,
    username: userName,
    userpw: userPw
  }
  try {
    axios.post(dbConnectionURl + "db/snugeusmartapp/addUser", body).then(
      (response)=> {
        return response.data;
      }
    )
  } catch(e) {
    console.log(e)
    throw e;
  }
}
export async function addDeviceToDB (userId: string, clientID: string, clientSecret: string, serialNumber: string, lat: number, lng: number,) {
  const body = {
    userid: userId,
    clientid: clientID,
    clientsecret: clientSecret,
    serialnumber: serialNumber,
    lat: lat,
    lng: lng
  }
  try {
    axios.post(dbConnectionURl + "db/snugeusmartapp/addDevice", body).then(
      (response)=> {
        getDeviceFromDB();
      }
    )
  } catch(e) {
    console.log(e)
    throw e;
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
/*export async function getUserFromDB(userName: string) {
  const apiKey = "FS7l3fI4e0K9lZl2wzEgPbqjzCMbfN6rYFVXPfVbLgc3qXxhTn6pZSTacKdwY4hy";
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "userdatacollection",
    filter: {
      username: userName
    }
  };

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'apiKey': apiKey
  };

  try {
    const response = await axios.post(dbURl + '/action/findOne', data, { headers });
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function getDeviceFromDB(userId: string) {
  const apiKey = "FS7l3fI4e0K9lZl2wzEgPbqjzCMbfN6rYFVXPfVbLgc3qXxhTn6pZSTacKdwY4hy";
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "devicedatacollection",
    filter: {
      userid: userId
    }
  };

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'apiKey': apiKey
  };

  try {
    const response = await axios.post(dbURl + '/action/findOne', data, { headers });
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}
export async function addUserToDB(userName: string, passWord: string ) {
  const apiKey = "FS7l3fI4e0K9lZl2wzEgPbqjzCMbfN6rYFVXPfVbLgc3qXxhTn6pZSTacKdwY4hy";
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
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'apiKey': apiKey
  };

  try {
    const response = await axios.post(dbURl + '/action/insertOne', data, { headers });
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}
export async function addDeviceToDB(userId: string, clientId: string, clientSecret: string, serialNumber: string, lat:number, lng: number ) {
  const apiKey = "FS7l3fI4e0K9lZl2wzEgPbqjzCMbfN6rYFVXPfVbLgc3qXxhTn6pZSTacKdwY4hy";
  const data = {
    dataSource: "SnugSmartApp",
    database: "snugsmartappeudb",
    collection: "userdatacollection",
    document: {
      userid: userId,
      clientid: clientId,
      clientsecret: clientSecret,
      serialnumber: serialNumber
    }
  };

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'apiKey': apiKey
  };

  try {
    const response = await axios.post(dbURl + '/action/insertOne', data, { headers });
    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}
*/


