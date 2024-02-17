<template>
  <v-card style="display: flex; align-items: center; flex-direction: column; justify-content: center;">
    <v-row v-if="!loading" :style="{ fontSize: '7vh', position: 'absolute', color: fontColor }">
      {{ weather + '°' }}
    </v-row>
    <v-row v-else>loading...</v-row>
    <v-row style="font-size: 2vh; position: absolute; margin-top: 40%;">
      Current outdoor temperature
    </v-row>
  </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getWeatherForecastByArea, TimeSeries, getWeatherLinkData } from '@/utils/APIRequests'
import { currentTimeUTCOption1 } from '@/utils/globalUtils'
import { useAppStore } from '@/store/app';
const weather = ref(0);
const loading = ref(false)
const fontColor = ref('black')
const user = useAppStore().User

onMounted(async () => {
  try {
    loading.value = true
    if (user.WeatherStation.Id !== '') {
      const weatherData = await getWeatherLinkData(user.WeatherStation.Id, user.WeatherStation.ApiSecret, user.WeatherStation.ApiKey)
      weather.value = (weatherData.sensors.data.temp_out - 32) * 5/9
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
      }
      if (weather.value < 0) {
        fontColor.value = 'blue'
      } else if (weather.value <= 10) {
        fontColor.value = 'lightblue'
      } else {
        fontColor.value = 'red'
      }
    }


  } catch (error) {
    console.error('Error fetching weather data:', error);
  } finally {
    loading.value = false
  }

});
</script>