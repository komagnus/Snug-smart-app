<template>
    <TopBar />
    <v-container >
        <v-row style="display: flex; justify-content: center; max-height: 40%;">
            <ChartView style="width: 80%; margin-bottom: 5%;"/>
        </v-row>
        <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 25vw; margin-top: 10%;">
            <WeatherWidget style="width: 40%; height: 100%;"/>
            <PowerPriceCard style="width: 40%; height: 100%;"/>
        </v-row>
        <v-row style="display: flex; flex-direction: row; justify-content: space-evenly; height: 25vw; margin-top: 10%;">
        <DeviceData />
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import WeatherWidget from "@/components/WeatherWidget.vue";
import PowerPriceCard from "@/components/PowerPriceCard.vue";
import ChartView from "@/components/ChartView.vue";
import  TopBar   from '@/components/TopBar.vue'
import DeviceData from "@/components/DeviceData.vue";
import { useAppStore } from "@/store/app";
import { onMounted } from 'vue'
import router from "@/router";

const userStore = useAppStore()
const name = userStore.User.Name
onMounted( () => {
    /*if(!userStore.User.IsLoggedIn) {
        router.push('/')
    }*/
})
</script>