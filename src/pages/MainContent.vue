<template>
    <TopBar />
    <v-container>
        <v-row id="chartRowStyle">
            <ChartView style="margin-bottom: 5%;" />
        </v-row>
        <v-row class="rowStyle" style="margin-top: 10%;">
            <WeatherWidget class="cardStyle" />
            <PowerPriceCard class="cardStyle" />
            <DeviceData />
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import WeatherWidget from "@/components/WeatherWidget.vue";
import PowerPriceCard from "@/components/PowerPriceCard.vue";
import ChartView from "@/components/ChartView.vue";
import TopBar from '@/components/TopBar.vue'
import DeviceData from "@/components/DeviceData.vue";
import { useAppStore } from "@/store/app";
import { onMounted } from 'vue'
import '@/styles/style.css'
import router from "@/router";

const userStore = useAppStore()
const name = userStore.User.Name
onMounted(() => {
    if (!userStore.User.IsLoggedIn) {
        router.push('/')
    }
})
</script>