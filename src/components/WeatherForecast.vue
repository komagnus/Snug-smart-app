<template>
    <v-dialog backgroundColor="white" width="80%" persistent v-model="showDialog">
    <v-card style="display: flex; align-items: center; width: 100%; height: 40vh;">
    <v-col @click="showDialog = false" style="align-self: flex-end; cursor: pointer;">
          <v-icon size="large" >
            mdi-close
          </v-icon>
    </v-col>
        <iframe :src="src" style="width: 100%; height: 100%; border: none;" ></iframe>
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
const src = ref('')
const emit = defineEmits();
watch(() => props.showDialogProp, (newValue) => {
    showDialog.value = newValue;
});
onMounted(async () => {
    try{
        const lat = user.ClientLocation.Lat;
        const lng = user.ClientLocation.Lng;
       src.value = 'https://www.yr.no/nb/innhold/' + lat + ',' + lng + '/card.html'
        const weatherData = await getWeatherForecastByArea(lat, lng);
        const currentTimeUTC = currentTimeUTCOption1;
        const matchedTimeseries = weatherData.properties.timeseries.find(
        (timeseries: TimeSeries) => timeseries.time === currentTimeUTC
        );
        if (matchedTimeseries) {
            weather.value = matchedTimeseries.data.instant.details.air_temperature;
        }
        } catch (e) {
            console.log(e)
        }
    })
  </script>
  