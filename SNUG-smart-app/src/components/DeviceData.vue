<template>
  <v-card style="display: flex; align-items: center; flex-direction: column; justify-content: space-evenly; width: 40%; height: 100%;">
    <v-row style="font-size: 7vh; position: absolute;"> {{ currentTempt + '°' }}</v-row>
    <v-row  style="font-size: 2vh; position: absolute; margin-top: 40%;">
        Current indoor temperature
    </v-row>
    <v-row @click="showMoreDeviceData = true" style="cursor: pointer;font-size: 1vh; text-decoration: underline; position: absolute; margin-top: 60%;">
      More about room climate
    </v-row>
  </v-card>
  <v-card
    style="display: flex; align-items: center; flex-direction: column; justify-content: center; width: 40%; height: 100%;">
    <v-row style="font-size: 7vh; position: absolute;"> {{ formattedTemp + '°' }}</v-row>
    <v-slider 
    v-model="temp"
    min="15"
    max="30"
    style="width: 60%; margin-top: 40%;">
  </v-slider>
  <v-row  style="font-size: 2vh; position: absolute; margin-top: 40%;">
        Desired indoor temperature
  </v-row>
  </v-card>
  <v-dialog v-model="showMoreDeviceData" persistent width="50%">
  <v-card
  style="width: 100% ;display: flex; justify-content: space-evenly; flex-direction: column; margin-top: 1%;"
  >
    <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 20vw; margin-top: 10%;">
      <v-card style="display: flex; align-items: center; flex-direction: column; justify-content: center; width: 40%; height: 100%;">
        <v-row style="font-size: 5vh; position: absolute;">{{ battery  }}</v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 45%;">Battery Percentage</v-row> 
      </v-card>
      <v-card style="display: flex; align-items: center; flex-direction: column; justify-content: center; width: 40%; height: 100%;">
        <v-row style="font-size: 5vh; position: absolute;">{{ co2 }} </v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 50%">Co2 Level</v-row>
      </v-card>
    </v-row>
    <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 20vw; margin-top: 10%;">
      <v-card  style="display: flex; align-items: center; flex-direction: column; justify-content: center; width: 40%; height: 100%;">
        <v-row style="font-size: 5vh; position: absolute;">{{ humidity }}</v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 45%;">Humidity</v-row>
      </v-card>
      <v-card  style="display: flex; align-items: center; flex-direction: column; justify-content: center; width: 40%; height: 100%;">
        <v-row style="font-size: 5vh; position: absolute;">{{ pressure}}</v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 45%;">Air pressure</v-row>
      </v-card>
    </v-row>
    <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 20vw; margin-top: 10%;">
      <v-card  style="display: flex; align-items: center; flex-direction: column; justify-content: center; width: 40%; height: 100%;">
        <v-row style="font-size: 5vh; position: absolute;">{{ radonValue }}</v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 45%;">Radon value</v-row>
      </v-card>
      <v-card  style="display: flex; align-items: center; flex-direction: column; justify-content: center; width: 40%; height: 100%;">
        <v-row style="font-size: 5vh; position: absolute;">{{ voc }}</v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 45%;">Volatile organic compound</v-row>
      </v-card>
    </v-row>
    <v-btn style="margin: 5%;" @click="showMoreDeviceData = false">Close</v-btn>
  </v-card>
</v-dialog>
</template>
<script setup lang="ts">
import { createAccountToken, getDeviceInfo } from '@/utils/APIRequests';
import { ref, onMounted, computed } from 'vue';

const loading = ref(false)
const temp = ref(0)
const battery = ref(0)
const co2 = ref(0)
const humidity = ref(0)
const pressure = ref(0)
const currentTempt = ref(0)
const radonValue = ref(0)
const voc = ref(0)
const showMoreDeviceData = ref(false);

const formattedTemp = computed(() => {
  return temp.value.toFixed(1); 
})
onMounted(async () => {
  try {
    loading.value = true
    const getToken = await createAccountToken('a0b5890d-06ae-43a5-84db-a337cdde35f9', '38d977b1-fb1a-4ae0-a06c-cb7c91edd28c')
    const accessToken = getToken.access_token
    const deviceData = await getDeviceInfo('2960080965', accessToken)
    currentTempt.value = deviceData.data.temp
    temp.value = deviceData.data.temp
    battery.value = deviceData.data.battery
    co2.value = deviceData.data.co2
    humidity.value = deviceData.data.humidity
    pressure.value = deviceData.data.pressure
    radonValue.value = deviceData.data.radonShortTermAvg
    voc.value = deviceData.data.voc
  } catch (e) {
    console.log(e)
  }

});
</script>