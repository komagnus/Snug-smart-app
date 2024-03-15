<template>
  <v-col style="position: absolute;align-self: flex-start;">
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" size="x-small">
          mdi-information-outline
        </v-icon>
      </template>
      <span>
        The displayed electricity price is the spot price.
        <br />
        The price you pay for electricity depends on your supply deal.
      </span>
    </v-tooltip>
  </v-col>
  <LineChart id="chartStyle" :chartData="data" :options="options" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { getCurrentPowerPrice, PowerPriceSeries } from '@/utils/APIRequests'
import { currentTimeUTCOption2, tomorrowUTCTime } from '@/utils/globalUtils'

Chart.register(...registerables);
export default defineComponent({
  name: 'PowerPriceChart',
  components: { LineChart },
  setup() {
    const loadData = async () => {
      const currentTimeInISOFormat = currentTimeUTCOption2;
      const tomorrow = tomorrowUTCTime
      const [datePart, timePart] = currentTimeInISOFormat.split('T');
      const [tomorrowDatePart, tomorrowTimePart] = tomorrow.split('T');
      const [year, month, day] = datePart.split('-');
      const [tomorrowYear, tomorrowMonth, tomorrowDay] = tomorrowDatePart.split('-');
      const currentTime = new Date(Date.parse(currentTimeInISOFormat));
      currentTime.setHours(currentTime.getHours() + 1);
      const hours = currentTime.getHours();
      const priceArea = 'NO1';
      const powerData = await getCurrentPowerPrice(year, month, day, priceArea);
      const nokValues: number[] = [];
      powerData.forEach(entry => {
        nokValues.push(entry.NOK_per_kWh);
      });
      const nokValues2: number[] = [];
      if (hours >= 13) {
        const powerData2 = await getCurrentPowerPrice(year, tomorrowMonth, tomorrowDay, priceArea);
        powerData2.forEach(entry => {
          nokValues2.push(entry.NOK_per_kWh);
        });
      }
      const data = {
        labels: [
          '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',],
        datasets: [
          {
            label: 'Electricity spot price today',
            borderColor: 'green',
            data: nokValues,
            borderRadius: 2,
          },
          {
            label: 'Electricity spot price tomorrow',
            borderColor: 'blue',
            data: nokValues2,
            borderRadius: 2,
          }
        ],
      };
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            borderWidth: 10,
            tension: 0.6,
          },
          point: {
            radius: 0,
            hoverRadius: 10,
            backgroundColor: 'black'
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            title: {
              display: true,
              text: 'Hour'
            }
          },
          y: {
            grid: {
              display: false,
            },
            title: {
              display: true,
              text: 'Price (NOK / kWh)'
            }
          },
        },
      };

      return { data, options };
    };

    return loadData();
  },
});

</script>