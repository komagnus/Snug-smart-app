<template>
    <v-card
    title="Account Settings"
    style="display: flex; flex-direction: column; align-items: center; width: 100%;">
    <v-btn style="display: flex; justify-content: space-evenly; width: 80%; margin: 1%;" >
      <v-icon icon="mdi-account" size="large"></v-icon>
      <div>Edit Account</div>
    </v-btn>
    <v-btn style="display: flex; justify-content: space-evenly; width: 80%; margin: 1%;" @click="signOut" >
      <v-icon icon="mdi-logout" size="large"></v-icon>
      <div>Sign out</div>
    </v-btn>
    </v-card>
</template>
<script setup lang="ts">
import router from '@/router';
import { useAppStore } from '@/store/app';


const userStore = useAppStore()
function signOut() {
  userStore.User.IsLoggedIn = false
  router.push('/')
}
</script>