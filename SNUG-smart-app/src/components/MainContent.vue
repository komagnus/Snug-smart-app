<template>
    <v-container style="display: flex; justify-content: space-evenly; flex-direction: column;">
        <v-row style="display: flex; justify-content: space-evenly; height: 25vw; margin-top: 5%;">
            <HumidityCard style="width: 40%;"/>
            <WeatherWidget style="width: 40%;"/>
        </v-row>
        <v-row style="display: flex;justify-content: space-evenly; height: 25vw; margin-top: 5%;">
            <Cardnr3 style="width: 40%;"/>
            <Cardnr4 style="width: 40%;"/>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import HumidityCard from "./mainComponents/HumidityCard.vue"
import WeatherWidget from "./mainComponents/WeatherWidget.vue"
import Cardnr3 from "./mainComponents/Cardnr3.vue";
import Cardnr4 from "./mainComponents/Cardnr4.vue";
</script>