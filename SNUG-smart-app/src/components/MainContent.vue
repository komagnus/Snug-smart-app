<template>
    <v-container style="display: flex; justify-content: space-evenly; flex-direction: column;">
        <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 25vw; margin-top: 5%;">
            <PowerPriceChart style="width: 100%;"/>
        </v-row>
        <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 25vw; margin-top: 5%;">
            <WeatherWidget style="width: 40%;"/>
            <PowerPriceCard style="width: 40%;"/>
        </v-row>
        <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 25vw; margin-top: 5%;">
            <TemperatureKnob style="width: 100%;"/>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import WeatherWidget from "./mainComponents/WeatherWidget.vue"
import PowerPriceCard from "./mainComponents/PowerPriceCard.vue";
import PowerPriceChart from "./mainComponents/PowerPriceChart.vue";
import TemperatureKnob from "./mainComponents/TemperatureKnob.vue";
</script>