<template>
    <v-dialog backgroundColor="white" width="80%" v-model="showDialog">
    <v-card style="display: flex; align-items: center; width: 100%; height: 50vh;">
        <iframe src="https://www.yr.no/nb/innhold/1-72837/card.html"></iframe>
    </v-card>
    </v-dialog>
  </template>
<script setup lang="ts">
import { ref, defineProps, onMounted, watch, defineEmits } from 'vue';
import { getWeatherForecastByArea, TimeSeries } from '@/utils/APIRequests'
import { currentTimeUTCOption1, tomorrowUTCTime,  } from '@/utils/globalUtils'
import { useAppStore } from '@/store/app';
const showDialog = ref(false)
  const props = defineProps({
    showDialogProp: Boolean 
  });

const weather = ref(0);
const user = useAppStore().User
const emit = defineEmits();
watch(() => props.showDialogProp, (newValue) => {
    showDialog.value = newValue;
});
/*onMounted(async () => {
    try{
        const lat = user.ClientLocation.Lat;
        const lon = user.ClientLocation.Lng;
        const weatherData = await getWeatherForecastByArea(lat, lon);
        const currentTimeUTC = currentTimeUTCOption1;
        const matchedTimeseries = weatherData.properties.timeseries.find(
        (timeseries: TimeSeries) => timeseries.time === currentTimeUTC
        );
        if (matchedTimeseries) {
            weather.value = matchedTimeseries.data.instant.details.air_temperature;
            console.log(weather.value)
        }
        } catch (e) {
            console.log(e)
        }
    })
    */
  </script>
  