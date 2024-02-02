<template>
  <v-card style="display: flex; align-items: center; flex-direction: column; justify-content: space-evenly; width: 40%; height: 100%;">
    <v-list style="width: 100%;">
      <v-list-subheader>Data</v-list-subheader>
      <v-list-item v-for="(item, i) in info" :key="i" :value="item" color="primary" rounded="shaped">
        <v-list-item-title v-text="item.name"></v-list-item-title>
        <v-list-item-title v-text="item.value"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
  <v-card
    style="display: flex; align-items: center; flex-direction: column; justify-content: center; width: 40%; height: 100%;">
    <v-row style="font-size: 7vh; position: absolute;"> {{ formattedTemp }}</v-row>
    <v-slider 
    v-model="temp"
    min="15"
    max="30"
    style="width: 60%; margin-top: 40%;">
  </v-slider>
  </v-card>
</template>
<script setup lang="ts">
import { createAccountToken, getDeviceInfo } from '@/utils/APIRequests';
import { ref, onMounted, computed } from 'vue';
import TemperatureSlider from './TemperatureSlider.vue';

const loading = ref(false)
const temp = ref(0)
const battery = ref(0)
const co2 = ref(0)
const humidity = ref(0)
const pressure = ref(0)

const info = [
  { name: 'Battery', value: battery },
  { name: 'CO2', value: co2 },
  { name: 'Humidity', value: humidity },
  { name: 'Pressure', value: pressure }
];

const formattedTemp = computed(() => {
  return temp.value.toFixed(1); 
})
onMounted(async () => {
  try {
    loading.value = true
    const getToken = await createAccountToken('a0b5890d-06ae-43a5-84db-a337cdde35f9', '38d977b1-fb1a-4ae0-a06c-cb7c91edd28c')
    const accessToken = getToken.access_token
    const deviceData = await getDeviceInfo('2960080965', accessToken)

    temp.value = deviceData.data.temp
    battery.value = deviceData.data.battery
    co2.value = deviceData.data.co2
    humidity.value = deviceData.data.humidity
    pressure.value = deviceData.data.pressure

  } catch (e) {
    console.log(e)
  }

});
</script>