<template>
    <v-card style="display: flex; align-items: center; flex-direction: column; justify-content: space-evenly;">
        <v-row v-if="!loading" class="text-h1" style="margin: 10px; margin-top: 20%;">
            {{humidity + '%'}} 
        </v-row>
        <v-row v-else>loading...</v-row>

        <v-row class="text-h5" style="margin: 10px;">
        Humidity
        </v-row>
    </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getWeatherForecastByArea, TimeSeries } from '@/utils/APIRequests'
const humidity = ref(null);
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const weatherData = await getWeatherForecastByArea(lat, lon);
      const currentTimeUTC = new Date().toISOString().slice(0, 14) + '00:00Z';
      const matchedTimeseries = weatherData.properties.timeseries.find(
        (timeseries: TimeSeries) => timeseries.time === currentTimeUTC
      );
      if (matchedTimeseries.data) {
        humidity.value = matchedTimeseries.data.instant.details.relative_humidity;
      } 
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
  } finally {
    loading.value = false
  }
});
</script>