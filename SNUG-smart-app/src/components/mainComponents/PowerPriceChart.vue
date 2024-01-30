<template>
  <v-switch label="Tomorrow" v-model="tomorrow"></v-switch>
  <LineChart style="width: 90%;" :chartData="data" :options="options" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { getCurrentPowerPrice, PowerPriceSeries } from '@/utils/APIRequests'
import { currentTimeUTCOption2 } from '@/utils/globalUtils'
import { ref } from 'vue';
import { computed } from 'vue';

Chart.register(...registerables);
export default defineComponent({
  name: 'PowerPriceChart',
  components: { LineChart },
  setup() {
    const tomorrow = ref(false)
    const loadData = async () => {
      const currentTimeInISOFormat = currentTimeUTCOption2;
      const [datePart, timePart] = currentTimeInISOFormat.split('T');
      const [year, month, day] = datePart.split('-');
      const dayToUse = ref(day)
      if (tomorrow.value) {
        dayToUse.value = '31'
      }
      const currentTime = new Date(Date.parse(currentTimeInISOFormat));
      currentTime.setHours(currentTime.getHours() + 1);
      const priceArea = 'NO1';
      const powerData = await getCurrentPowerPrice(year, month, dayToUse.value, priceArea);
      const nokValues: number[] = [];
      powerData.forEach(entry => {
        nokValues.push(entry.NOK_per_kWh);
      });
      const data = {
        labels: [
          '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00',
        ],
        datasets: [
          {
            label: 'Power price',
            backgroundColor: 'green',
            data: nokValues,
          },
        ],
      };
      const options = {
        responsive: true,
        maintainAspectRatio: false,
      };

      return { data, options, tomorrow };
    };

    // Call the async function and return the promise
    return loadData();
  },
});

</script>