<template>
    <v-card style="display: flex; align-items: center; flex-direction: column; justify-content: space-evenly;">
        <v-row v-if="!loading"  :style="{ fontSize: '7vh', position: 'absolute', color: fontColor }">
            {{powerPrice }} 
        </v-row>
        <v-row v-else>loading...</v-row>
        <v-row style="font-size: 2vh; position: absolute; margin-top: 40%;">
        Øre / kWh
        </v-row>
        <v-col @click="toggleDisplaySchedule" style="align-self: flex-end; cursor: pointer;">
          <v-icon size="large" >
            mdi-home-clock-outline
          </v-icon>
        </v-col>
    <power-schedule :dialog-visible-prop="displaySchedule"/>
    </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCurrentPowerPrice, PowerPriceSeries } from '@/utils/APIRequests'
import { currentTimeUTCOption2 } from '@/utils/globalUtils'
import PowerSchedule from './PowerSchedule.vue';
const powerPrice = ref(0);
const loading = ref(false);
const fontColor = ref('black');
const displaySchedule = ref(false)

onMounted(async () => {
  try {
  loading.value = true
  const currentTimeInISOFormat  = currentTimeUTCOption2;
  const [datePart, timePart] = currentTimeInISOFormat.split('T');
  const [year, month, day] = datePart.split('-');
  const currentTime = new Date(Date.parse(currentTimeInISOFormat));
  currentTime.setHours(currentTime.getHours() + 1);
  const hourLater = new Date(currentTime.getTime() + (60 * 60 * 1000));
  const hourLaterISO = hourLater.toISOString().slice(0, -5) + currentTimeInISOFormat.slice(-6);
  const priceArea = 'NO1';
  const powerData = await getCurrentPowerPrice(year, month, day, priceArea);
  const matchedPowerPriceSeries = powerData.find(
        (powerPriceSeries: PowerPriceSeries) => {
            return powerPriceSeries.time_start === currentTimeInISOFormat && powerPriceSeries.time_end === hourLaterISO
        }
    );
    if (matchedPowerPriceSeries) {
      let value = matchedPowerPriceSeries.NOK_per_kWh;
    let formattedValue;
    if (value >= 1) {
        formattedValue = Math.floor(value); 
    } else {
        formattedValue = Math.floor(value * 100); 
    }
    powerPrice.value = formattedValue;   
  }
    if(powerPrice.value < 100) {
      fontColor.value = 'green'
    } else {
      fontColor.value = 'red'
    } 
  } catch (error) {
    console.error('Error fetching powerprice data:', error);
  } finally {
    loading.value = false
  }
});
function toggleDisplaySchedule () {
  if(displaySchedule.value === true) {
    displaySchedule.value = false
  } else {
    displaySchedule.value = true
  }
}

</script>