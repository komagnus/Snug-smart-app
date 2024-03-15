import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    User: {
      Name: '',
      IsLoggedIn: false,
      ClientID: '',
      ClientSecret: '',
      ClientLocation: {
        Lat: 0,
        Lng: 0
      },
      UserId: '',
      UserName: '',
      SerialNumber: '',
      WeatherStation: {
        Id: '',
        ApiKey: '',
        ApiSecret: ''
      }
    }
  }),
})
