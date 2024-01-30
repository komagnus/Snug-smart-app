<template>
  <v-card id="chart">
    <!--<apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>-->
  </v-card>
</template>

<script lang="ts">
import VueApexCharts from 'vue-apexcharts'


export default {
  el: '#app',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [{
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Product Trends by Month',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          },
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }
      },
    }
  },
};
</script>

<style scoped>
</style>
