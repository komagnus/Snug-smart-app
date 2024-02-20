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
    style="width: 60%; margin-top: 50%;"
    @change="console.log('test')"
    >
    </v-slider>
  <v-row  style="font-size: 2vh; position: absolute; margin-top: 60%;">
        Desired indoor temperature
  </v-row>
  </v-card>
  <v-dialog v-model="showMoreDeviceData" persistent width="80%">
  <v-card
  style="width: 100% ;display: flex; justify-content: space-evenly; flex-direction: column; margin-top: 1%;"
  >
    <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 20vw; margin-top: 10%;">
      <v-card :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%',  backgroundColor: batteryColor}">
        <v-row  :style="{fontSize: '5vh', position: 'absolute'}">{{ battery  }} <span style="font-size: 2vh; align-self: center;">%</span></v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 35%;">Battery Percentage</v-row> 
      <v-col style="align-self: flex-end;">
        <v-tooltip location="bottom"  >
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" size="x-small" >
            mdi-information-outline
              </v-icon>
        </template>
        <span>The battery status of the device you are connected to</span>
      </v-tooltip>
    </v-col>
      </v-card>
      <v-card :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%',  backgroundColor: co2Color}">
        <v-row :style="{fontSize: '5vh', position: 'absolute'}">{{ co2 }} <span style="font-size: 2vh; align-self: center;">ppm</span></v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 35%">Co2 Level</v-row>
        <v-col style="align-self: flex-end;">
        <v-tooltip location="bottom"  >
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" size="x-small" >
            mdi-information-outline
              </v-icon>
        </template>
        <span>
          Most researchers agree that carbon dioxide levels 
          <br/>
          that are below 800 ppm are considered ideal. 
          <br/>
          Generally values over 1000ppm indicate potential
          <br/>
           issues with air circulation
        </span>
      </v-tooltip>
    </v-col>
      </v-card>
    </v-row>
    <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 20vw; margin-top: 10%;">
      <v-card  :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%',  backgroundColor: humidityColor}">
        <v-row :style="{fontSize: '5vh', position: 'absolute'}">{{ humidity }}<span style="font-size: 2vh; align-self: center;">%</span></v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 35%;">Humidity</v-row>
        <v-col style="align-self: flex-end;">
        <v-tooltip location="bottom"  >
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" size="x-small" >
            mdi-information-outline
              </v-icon>
        </template>
        <span>
          Indoor environments with a humidity level of below 
          <br/>
          30%-40% make the spread of infections more likely, 
          <br/>
          while fungi and mold are more likely to grow if level
          <br/>
           is over 70%. Therefore is 41-69% the ideal level. </span>
      </v-tooltip>
    </v-col>
      </v-card>
      <v-card  :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%',  backgroundColor: pmColor}">
        <v-row :style="{fontSize: '5vh', position: 'absolute'}">{{ pm }}<span style="font-size: 2vh; align-self: center;">µg/m3</span></v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 35%;">Particulate matter</v-row>
        <v-col style="align-self: flex-end;">
        <v-tooltip location="bottom"  >
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" size="x-small" >
            mdi-information-outline
              </v-icon>
        </template>
        <span>
          There are no "Optimal level" for Particulate matter, 
          <br/>
          however, the recommended limit is 5 µg/m3
        </span>
      </v-tooltip>
    </v-col>
      </v-card>
    </v-row>
    <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 20vw; margin-top: 10%;">
      <v-card  :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%',  backgroundColor: radonValueColor}">
        <v-row :style="{fontSize: '5vh', position: 'absolute'}">{{ radonValue }}<span style="font-size: 2vh; align-self: center;"> Bq/m3</span></v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 35%;">Radon value</v-row>
        <v-col style="align-self: flex-end;">
        <v-tooltip location="bottom"  >
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" size="x-small" >
            mdi-information-outline
              </v-icon>
          </template>
          <span>
            There is no set "Optimal level" for radon levels. 
            <br/>
            However, The World Health Organization states that 
            <br/>
            levels belo 100 Bq/m3 are not a cause for concern
          </span>
          </v-tooltip>
        </v-col>
      </v-card>
      <v-card  :style="{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '40%', height: '100%',  backgroundColor: vocColor}">
        <v-row :style="{fontSize: '5vh', position: 'absolute'}">{{ voc }}<span style="font-size: 2vh; align-self: center;">ppb</span>  </v-row>
        <v-row style="font-size: 1.5vh; position: absolute; margin-top: 35%;">Volatile organic compound</v-row>
        <v-col style="align-self: flex-end;">
        <v-tooltip location="bottom"  >
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" size="x-small">
            mdi-information-outline
              </v-icon>
        </template>
        <span>
          Airborne chemicals (VOCs) consist of many substances of 
          <br/>
          varying toxicity which can cause eyes, nose, and throat 
          <br/>
          irritation. Any value below 250ppb is no cause for concern
        </span>
      </v-tooltip>
    </v-col>
      </v-card>
    </v-row>
    <v-btn style="margin: 5%;" @click="showMoreDeviceData = false">Close</v-btn>
  </v-card>
</v-dialog>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { createAccountToken, getDeviceData } from '@/utils/APIRequests';
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
const batteryColor = ref('grey')
const co2Color = ref('grey')
const humidityColor = ref('grey')
const pmColor = ref('grey')
const radonValueColor = ref('grey')
const vocColor = ref('grey')
const formattedTemp = computed(() => {
  return temp.value.toFixed(1); 
})
function updateTemperature() {
  console.log('Executed')
}
onMounted(async () => {
  try {
    const userStore = useAppStore()
    loading.value = true
    const getToken = await createAccountToken(userStore.User.ClientID, userStore.User.ClientSecret)
    const accessToken = getToken.access_token
    const deviceData = await getDeviceData(userStore.User.SerialNumber, accessToken)
    currentTempt.value = deviceData.data.temp
    temp.value = deviceData.data.temp
    battery.value = deviceData.data.battery
    co2.value = deviceData.data.co2
    humidity.value = deviceData.data.humidity
    pm.value = deviceData.data.pm25
    radonValue.value = deviceData.data.radonShortTermAvg
    voc.value = deviceData.data.voc
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