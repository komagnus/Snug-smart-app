import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useValueStore = defineStore('values', {
  state: () => ({
    BatteryHigh: ref(70),
    BatteryLow: ref(30),
    Co2Warning: ref(800),
    Co2High: ref(1000)
  }),
})

export const useLimitStore = defineStore('values', {
  state: () => ({
    PriceLimit: ref(70),
  }),
})