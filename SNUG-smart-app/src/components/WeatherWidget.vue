<template>
    <v-card style="display: flex; align-items: center; flex-direction: column; justify-content: center;">
       <v-row v-if="!loading"  :style="{ fontSize: '7vh', position: 'absolute', color: fontColor }">
        {{ weather + '°' }}
       </v-row>
       <v-row v-else>loading...</v-row>
       <v-row  style="font-size: 2vh; position: absolute; margin-top: 40%;">
        Current outdoor temperature
       </v-row>
    </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getWeatherForecastByArea, TimeSeries  } from '@/utils/APIRequests'
import { currentTimeUTCOption1 } from '@/utils/globalUtils'
const weather = ref(0);
const loading = ref(false)
const fontColor = ref('black')

onMounted(async () => {
  try {
    loading.value = true
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const weatherData = await getWeatherForecastByArea(lat, lon);
      const currentTimeUTC = currentTimeUTCOption1;
      const matchedTimeseries = weatherData.properties.timeseries.find(
        (timeseries: TimeSeries) => timeseries.time === currentTimeUTC
      );
      if (matchedTimeseries) {
        weather.value = matchedTimeseries.data.instant.details.air_temperature;
      } 
      if(weather.value < 0) {
        fontColor.value = 'blue'
      } else if (weather.value <= 10) {
        fontColor.value = 'lightblue'
      } else {
        fontColor.value = 'red'
      }
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
  } finally {
    loading.value = false
  }

});
</script>