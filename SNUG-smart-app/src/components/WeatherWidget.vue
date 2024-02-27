<template>
  <v-card v-if="!enableRetry" style="display: flex; align-items: center; flex-direction: column; justify-content: center;">
    <v-row v-if="!loading" :style="{ fontSize: '7vh', position: 'absolute', color: fontColor }">
      {{ weather + '°' }}
    </v-row>
    <v-row v-else style="position: absolute">loading...</v-row>
    <v-row style="font-size: 2vh; position: absolute; margin-top: 40%;">
      Current outdoor temperature
    </v-row>
    <v-col @click="toggleForecastDisplay" style="align-self: flex-end; cursor: pointer;">
          <v-icon size="large" >
            mdi-weather-cloudy-clock
          </v-icon>
    </v-col>
    <weather-forecast :show-dialog-prop="displayForecast"/>
  </v-card>
  <v-card v-else style="display: flex; align-items: center; flex-direction: column; justify-content: center;">
    <v-row v-if="!loading" :style="{ fontSize: '7vh', position: 'absolute', color: fontColor }">
      <v-icon style="cursor:pointer"
        size="large" 
        icon="mdi-refresh"
        @click="retryWeatherData"></v-icon>
    </v-row>
    <v-row v-else>loading...</v-row>
    <v-row style="font-size: 2vh; position: absolute; margin-top: 40%;">
      Current outdoor temperature
    </v-row>
  </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getWeatherForecastByArea, TimeSeries, getWeatherLinkData } from '@/utils/APIRequests'
import { currentTimeUTCOption1 } from '@/utils/globalUtils'
import { useAppStore } from '@/store/app';
import WeatherForecast from './WeatherForecast.vue'
const weather = ref(0);
const loading = ref(false)
const fontColor = ref('black')
const user = useAppStore().User
const enableRetry = ref(false)
const displayForecast = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    if (user.WeatherStation.Id !== '') {
      const weatherData = await getWeatherLinkData(user.WeatherStation.Id, user.WeatherStation.ApiSecret, user.WeatherStation.ApiKey)
      weather.value = ((weatherData.sensors[0].data[0].temp_out - 32) * 5/9).toFixed(1);
      enableRetry.value = false
    } else {
      const lat = user.ClientLocation.Lat;
      const lon = user.ClientLocation.Lng;
      const weatherData = await getWeatherForecastByArea(lat, lon);
      const currentTimeUTC = currentTimeUTCOption1;
      const matchedTimeseries = weatherData.properties.timeseries.find(
        (timeseries: TimeSeries) => timeseries.time === currentTimeUTC
      );
      if (matchedTimeseries) {
        weather.value = matchedTimeseries.data.instant.details.air_temperature;
        enableRetry.value = false
      }
      
    }
      if (weather.value < 0) {
        fontColor.value = 'blue'
      } else if (weather.value <= 10) {
        fontColor.value = 'lightblue'
      } else {
        fontColor.value = 'red'
      }
   


  } catch (error) {
    enableRetry.value = true
    console.error('Error fetching weather data:', error);
  } finally {
    loading.value = false
  }

});
async function retryWeatherData(){
  try {
    loading.value = true
    if (user.WeatherStation.Id !== '') {
      const weatherData = await getWeatherLinkData(user.WeatherStation.Id, user.WeatherStation.ApiSecret, user.WeatherStation.ApiKey)
      weather.value = ((weatherData.sensors[0].data[0].temp_out - 32) * 5/9).toFixed(1);
      enableRetry.value = false
    } else {
      const lat = user.ClientLocation.Lat;
      const lon = user.ClientLocation.Lng;
      const weatherData = await getWeatherForecastByArea(lat, lon);
      const currentTimeUTC = currentTimeUTCOption1;
      const matchedTimeseries = weatherData.properties.timeseries.find(
        (timeseries: TimeSeries) => timeseries.time === currentTimeUTC
      );
      if (matchedTimeseries) {
        weather.value = matchedTimeseries.data.instant.details.air_temperature;
        enableRetry.value = false
      }
      
    }
      if (weather.value < 0) {
        fontColor.value = 'blue'
      } else if (weather.value <= 10) {
        fontColor.value = 'lightblue'
      } else {
        fontColor.value = 'red'
      }


  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
function toggleForecastDisplay () {
  if(displayForecast.value === true) {
    displayForecast.value = false
  } else {
    displayForecast.value = true
  }
}
</script>