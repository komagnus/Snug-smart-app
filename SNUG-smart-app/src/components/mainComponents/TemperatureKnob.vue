<template>
  <v-card style="display: flex; align-items: center; flex-direction: column; justify-content: center; position: relative;">
    <div class="text-h1" style="margin: 10px; margin-top: 5%;">
      {{ value }}
    </div>
    <input type="range" min="15" max="30" v-model="value" />
      </v-card>
</template>

<script setup lang="ts">
import { temperature } from '@/utils/globalUtils';

const value = temperature
</script>
