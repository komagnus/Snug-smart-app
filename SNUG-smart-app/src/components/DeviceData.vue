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
    :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%'}">
    <v-row style="font-size: 7vh; position: absolute;"> {{ formattedTemp + '°' }}</v-row>
    <v-slider 
    v-model="temp"
    min="15"
    max="30"
    color="green"
    style="width: 60%; margin-top: 50%;">
  </v-slider>
  <v-row  style="font-size: 2vh; position: absolute; margin-top: 60%;">
        Desired indoor temperature
  </v-row>
  </v-card>
  <v-dialog v-model="showMoreDeviceData" persistent width="50%">
  <v-card
  style="width: 100% ;display: flex; justify-content: space-evenly; flex-direction: column; margin-top: 1%;"
  >
    <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 20vw; margin-top: 10%;">
      <v-card :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%',  backgroundColor: batteryColor}">
        <v-row  :style="{fontSize: '5vh', position: 'absolute'}">{{ battery  }} <span style="font-size: 3vh; align-self: center;">%</span></v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 45%;">Battery Percentage</v-row> 
      </v-card>
      <v-card :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%',  backgroundColor: co2Color}">
        <v-row :style="{fontSize: '5vh', position: 'absolute'}">{{ co2 }} <span style="font-size: 3vh; align-self: center;">ppm</span></v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 50%">Co2 Level</v-row>
      </v-card>
    </v-row>
    <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 20vw; margin-top: 10%;">
      <v-card  :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%',  backgroundColor: humidityColor}">
        <v-row :style="{fontSize: '5vh', position: 'absolute'}">{{ humidity }}<span style="font-size: 3vh; align-self: center;">%</span></v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 45%;">Humidity</v-row>
      </v-card>
      <v-card  :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%',  backgroundColor: pmColor}">
        <v-row :style="{fontSize: '5vh', position: 'absolute'}">{{ pm }}<span style="font-size: 3vh; align-self: center;">µg/m3</span></v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 45%;">Particulate matter</v-row>
      </v-card>
    </v-row>
    <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 20vw; margin-top: 10%;">
      <v-card  :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%',  backgroundColor: radonValueColor}">
        <v-row :style="{fontSize: '5vh', position: 'absolute'}">{{ radonValue }}<span style="font-size: 3vh; align-self: center;"> Bq/m3</span></v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 45%;">Radon value</v-row>
      </v-card>
      <v-card  :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%',  backgroundColor: vocColor}">
        <v-row :style="{fontSize: '5vh', position: 'absolute'}">{{ voc }}<span style="font-size: 3vh; align-self: center;">ppb</span>  </v-row>
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
const pm = ref(0)
const currentTempt = ref(0)
const radonValue = ref(0)
const voc = ref(0)
const showMoreDeviceData = ref(false);
const batteryColor = ref('black')
const co2Color = ref('black')
const humidityColor = ref('black')
const pmColor = ref('black')
const radonValueColor = ref('black')
const vocColor = ref('black')


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
    pm.value = deviceData.data.pm25
    radonValue.value = deviceData.data.radonShortTermAvg
    voc.value = deviceData.data.voc
    console.log(deviceData)
    if(battery.value >= 70) {
      batteryColor.value = 'Green'
    } else if(battery.value < 30){
      batteryColor.value = 'yellow'
    } else {
      batteryColor.value = 'red'
    }
    if(co2.value > 1000) {
      co2Color.value = 'red'
    } else if(co2.value > 800) {
      co2Color.value = 'yellow'
    } else {
      co2Color.value = 'green'
    }
    if(humidity.value >= 60) {
      humidityColor.value = 'red'
    } else if(humidity.value <= 40) {
      humidityColor.value = 'yellow'
    } else {
      humidityColor.value = 'green'
    }
    if(pm.value > 5) {
      pmColor.value = 'red'
    } else {
      pmColor.value = 'green'
    }
    if(radonValue.value >= 100) {
      radonValueColor.value = 'red'
    } else if(radonValue.value > 80) {
      radonValueColor.value = 'yellow'
    } else {
      radonValueColor.value = 'green'
    }
    if(voc.value >= 250) {
      vocColor.value = 'red'
    } else if(voc.value >= 175) {
      vocColor.value = 'yellow'
    } else {
      vocColor.value = 'green'
    }

  } catch (e) {
    console.log(e)
  }

});
</script>