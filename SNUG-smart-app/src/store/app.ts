import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useAppStore = defineStore('app', {
  state: () => ({
    User: {
      Name: ref(''),
      IsLoggedIn: ref(false),
      ClientID:  ref(''),
      ClientSecret: ref(''),
      ClientLocation: {
        Lat: ref(0),
        Lng: ref(0)
      },
      UserId: ref(''),
      UserName: ref(''),
      SerialNumber: ref('')
    }
  }),
})
