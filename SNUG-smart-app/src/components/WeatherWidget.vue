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
import { createAccountToken, getWeatherForecastByArea, getLocationInfo, TimeSeries  } from '@/utils/APIRequests'
import { currentTimeUTCOption1 } from '@/utils/globalUtils'
import { getDeviceInfo } from '@/utils/APIRequests';
const weather = ref(0);
const loading = ref(false)
const fontColor = ref('black')

onMounted(async () => {
  try {
    loading.value = true
    const getToken = await createAccountToken('a0b5890d-06ae-43a5-84db-a337cdde35f9', '38d977b1-fb1a-4ae0-a06c-cb7c91edd28c')
    const accessToken = getToken.access_token
    const deviceInfo = await getDeviceInfo('2960080965', accessToken)
    const locationID = deviceInfo.location.id
    const locationInfo = await getLocationInfo(locationID, accessToken)
    const lat = locationInfo.lat;
    const lon = locationInfo.lng;
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
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
  } finally {
    loading.value = false
  }

});
</script>