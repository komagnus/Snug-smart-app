<template>
  <v-card class="cardStyle">
    <v-row class="mainText"> {{ currentTempt + '°' }}</v-row>
    <v-row  class="subText" style="margin-top: 40%;">
        Current indoor temperature
    </v-row>
    <v-col @click="toggleShowMoreDeviceData" style="align-self: flex-end; cursor: pointer;">
          <v-icon size="large" >
            mdi-home-clock-outline
          </v-icon>
    </v-col>
  </v-card>
  <v-card class="cardStyle">
    <v-slider 
    v-model="temp"
    min="15"
    max="30"
    color="green"
    style="width: 60%;margin-bottom: 20%;"
    >
    </v-slider>
    <v-row class="mainText"> {{ formattedTemp + '°' }}</v-row>
  <v-row   class="subText" style="margin-top: 40%;">
        Desired indoor temperature
  </v-row>
  </v-card>
  <v-dialog v-model="showMoreDeviceData" persistent width="80%">
  <v-card
  style="width: 100% ;display: flex; justify-content: space-evenly; flex-direction: column; margin-top: 1%;"
  >
    <v-col @click="toggleShowMoreDeviceData" style="align-self: flex-end; cursor: pointer;">
      <v-icon size="large" >
          mdi-close
      </v-icon>
    </v-col>
    <v-row class="deviceDataRowStyle" style=" margin-top: 10%;">
      <v-card class="deviceCardStyle" :style="{backgroundColor: batteryColor}">
        <v-row  class="deviceDataMainText">{{ battery  }} <span class="unitStyle">%</span></v-row>
        <v-row class="deviceDataSubTitle" style=" margin-top: 35%;">Battery Percentage</v-row> 
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
      <v-card class="deviceCardStyle" :style="{backgroundColor: co2Color}">
        <v-row class="deviceDataMainText">{{ co2 }} <span class="unitStyle">ppm</span></v-row>
        <v-row class="deviceDataSubTitle" style=" margin-top: 35%">Co2 Level</v-row>
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
    <v-row class="deviceDataRowStyle" style=" margin-top: 10%;">
      <v-card  class="deviceCardStyle" :style="{backgroundColor: humidityColor}">
        <v-row class="deviceDataMainText">{{ humidity }}<span class="unitStyle">%</span></v-row>
        <v-row class="deviceDataSubTitle" style=" margin-top: 35%;">Humidity</v-row>
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
      <v-card  class="deviceCardStyle" :style="{backgroundColor: pmColor}">
        <v-row class="deviceDataMainText">{{ pm }}<span class="unitStyle">µg/m3</span></v-row>
        <v-row class="deviceDataSubTitle" style=" margin-top: 35%;">Particulate matter</v-row>
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
    <v-row class="deviceDataRowStyle" style="margin-top: 10%; margin-bottom: 10%;">
      <v-card  class="deviceCardStyle" :style="{backgroundColor: radonValueColor}">
        <v-row class="deviceDataMainText">{{ radonValue }}<span class="unitStyle"> Bq/m3</span></v-row>
        <v-row class="deviceDataSubTitle" style=" margin-top: 35%;">Radon value</v-row>
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
      <v-card  class="deviceCardStyle" :style="{backgroundColor: vocColor}">
        <v-row class="deviceDataMainText">{{ voc }}<span class="unitStyle">ppb</span>  </v-row>
        <v-row class="deviceDataSubTitle" style=" margin-top: 35%;">VOC</v-row>
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
  </v-card>
</v-dialog>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { createAccountToken, getDeviceData } from '@/utils/APIRequests';
import { ref, onMounted, computed, watch } from 'vue';

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
function toggleShowMoreDeviceData () {
  if(showMoreDeviceData.value === true) {
    showMoreDeviceData.value = false
  } else {
    showMoreDeviceData.value = true
  }
}
watch(() => temp, (newValue) => {
  if(newValue.value = 21) {
    updateTemperature()
  }
});
</script>