<template>
    <v-card style="display: flex; align-items: center; flex-direction: column; justify-content: space-evenly;">
      <v-list>
      <v-list-subheader>Data</v-list-subheader>
      <v-list-item
        v-for="(item, i) in info"
        :key="i"
        :value="item"
        color="primary"
        rounded="shaped"
      >
        <v-list-item-title v-text="item.name"></v-list-item-title>
        <v-list-item-title v-text="item.value"></v-list-item-title>
      </v-list-item>
    </v-list>
    </v-card>
</template>
<script setup lang="ts">
import { createAccountToken, getDeviceInfo } from '@/utils/APIRequests';
import { ref, onMounted } from 'vue';
import TemperatureKnob from './TemperatureKnob.vue';

const loading = ref(false)
const temp = ref(20)
const battery = ref(0)
const co2 = ref(0)
const humidity = ref(0)
const pressure = ref(0)

const info = [
  { name: 'Temperature', value: temp },
  { name: 'Battery', value: battery },
  { name: 'CO2', value: co2 },
  { name: 'Humidity', value: humidity },
  { name: 'Pressure', value: pressure }
];

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