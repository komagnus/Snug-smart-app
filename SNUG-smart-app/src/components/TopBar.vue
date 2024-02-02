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
    <v-list>
      <v-list-subheader>Settings</v-list-subheader>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        color="primary"
        rounded="shaped"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
    <v-btn @click="toggleShowSettings">Close</v-btn>
  </v-card>
</v-dialog>
  </v-row>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const showSettings = ref(false)
const items = [
    { text: 'Account', icon: 'mdi-account' },
    { text: 'Device', icon: 'mdi-access-point-network' },
    { text: 'Support', icon: 'mdi-face-agent' },
]
function toggleShowSettings () {
    if(showSettings.value === true) {
        showSettings.value = false 
    } else {
        showSettings.value = true
    }
}
</script>