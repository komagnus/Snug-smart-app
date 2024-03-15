import { defineStore } from 'pinia'


export const useValueStore = defineStore('values', {
  state: () => ({
    BatteryHigh: 70,
    BatteryLow: 30,
    Co2Warning: 800,
    Co2High: 1000
  }),
})

export const useLimitStore = defineStore('values', {
  state: () => ({
    PriceLimit: 70,
  }),
})