<template>
    <v-card style="display: flex; align-items: center; flex-direction: column; justify-content: space-evenly;">
        <v-row v-if="!loading" class="text-h1" style="margin: 10px; margin-top: 20%;">
            {{powerPrice }} 
        </v-row>
        <v-row v-else>loading...</v-row>

        <v-row class="text-h5" style="margin: 10px;">
        Øre / kWh
        </v-row>
    </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCurrentPowerPrice, PowerPriceSeries } from '@/utils/APIRequests'
import { currentTimeUTCOption2 } from '@/utils/globalUtils'
import { h } from 'vue';
const powerPrice = ref(0);
const loading = ref(false)

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
  console.log(currentTimeInISOFormat);
  console.log(hourLaterISO);
  const matchedPowerPriceSeries = powerData.find(
        (powerPriceSeries: PowerPriceSeries) => {
            return powerPriceSeries.time_start === currentTimeInISOFormat && powerPriceSeries.time_end === hourLaterISO
        }
    );
    console.log(matchedPowerPriceSeries)
        console.log(powerData)
    if (matchedPowerPriceSeries) {
      let value = matchedPowerPriceSeries.NOK_per_kWh;
    let formattedValue;
    
    if (value >= 1) {
        formattedValue = Math.floor(value); 
    } else {
        formattedValue = Math.floor(value * 100); 
    }

    powerPrice.value = formattedValue;   } 
  } catch (error) {
    console.error('Error fetching powerprice data:', error);
  } finally {
    loading.value = false
  }
});
</script>