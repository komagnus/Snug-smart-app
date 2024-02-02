<template>
  <v-card style="display: flex; align-items: center; flex-direction: column; justify-content: center; position: relative;">
  <temperature-slider />  
  </v-card>
</template>

<script setup lang="ts">
import { temperature } from '@/utils/globalUtils';
import TemperatureSlider from './TemperatureSlider.vue';


const value = temperature
</script>
