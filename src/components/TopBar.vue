<template>
        <v-row style="display: flex; align-items: center; justify-content:space-evenly; max-height: 10%; margin-top: 1%;">
        <img
        src="@/assets/snugeu_logo.jpg"
        style="cursor:pointer; max-height: 70px; max-width: 100%; object-fit: contain;"
        />
        <v-icon style="cursor:pointer"
        size="x-large" 
        icon="mdi-cog"
        @click="toggleShowSettings">
        </v-icon>
    </v-row>
    <v-row justify="center">
    <v-dialog v-model="showSettings" persistent width="50%">
  <v-card
    class="mx-auto pa-2"
    style="width: 100%;"
  >
  <v-col @click="toggleShowSettings" style="align-self: flex-end; cursor: pointer;">
      <v-icon size="large" >
        mdi-close
      </v-icon>
  </v-col>
  <v-expansion-panels> 
    <account-settings />
    <device-settings />
  </v-expansion-panels>
  </v-card>
</v-dialog>
  </v-row>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import AccountSettings from './AccountSettings.vue';
import DeviceSettings from './DeviceSettings.vue';

const showSettings = ref(false)
function toggleShowSettings () {
    if(showSettings.value === true) {
        showSettings.value = false 
    } else {
        showSettings.value = true
    }
}
</script>