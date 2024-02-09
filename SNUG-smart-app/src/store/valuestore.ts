import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useValueStore = defineStore('values', {
  state: () => ({
    batteryHigh: ref(70),
    batteryLow: ref(30),
    co2Warning: ref(800),
    co2High: ref(1000)
  }),
})
