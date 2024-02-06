<template>
      <v-container style="display: flex; height: 20%; width: 100%; justify-content: center; flex-direction: row; align-items: center;">
    <img
        src="@/assets/snugeu_logo.jpg"
        />
      </v-container>
    <v-container style="display: flex; height: 50%; width: 100%; margin-top: 0px; justify-content: center; flex-direction: row; align-items: center; margin-top: 10%;">
      <v-card class="mx-auto px-6 py-8" style="width: 60%; min-width: 300px; max-width: 600px;">
      <v-form
        v-model="form"
        @submit.prevent="getUser"
      >
      <v-text-field
          v-if="expandedForm"
          v-model="name"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Name"
        ></v-text-field>
        <v-text-field
          v-if="expandedForm"
          v-model="airthingsUsername"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Airthings account username"
        ></v-text-field>
        <v-text-field
          v-if="expandedForm"
          v-model="airthingsPassword"
          type="password"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Airthings account password"
        ></v-text-field>
        <v-text-field
          v-if="expandedForm"
          v-model="deviceSerialNumber"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Airthings device serial number"
        ></v-text-field>
        <v-text-field
          v-model="username"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Email"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          clearable
          type="password"
          label="Password"
          placeholder="Enter your password"
        ></v-text-field>
        <p v-if="incorrectLogin" style="color: red;">Incorrect email and/or password</p>
        <br>
        <div v-if="!expandedForm">
          <p >First time? Sign up and register device <span style="text-decoration: underline; cursor: pointer;" @click="expandedForm = true">here</span></p>
        </div>
        <br>
        <v-btn
        v-if="!expandedForm"
          :disabled="!form"
          :loading="loading"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Sign In
        </v-btn>
        <v-btn
        v-else
          :disabled="!form"
          :loading="loading"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Sign Up
        </v-btn>
      </v-form>
    </v-card>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import  TopBar   from '@/components/TopBar.vue'
  import { getUserFromDB } from '@/utils/APIRequests'
import { ref } from 'vue';
const router = useRouter();
const username = ref('')
const password = ref('')
const name = ref('')
const airthingsUsername = ref('')
const airthingsPassword = ref('')
const form = ref(false)
const loading = ref(false)
const expandedForm = ref(false)
const deviceSerialNumber = ref('')
async function getUser() {
  try{
  const checkUser = await getUserFromDB(username.value, password.value)
  if(checkUser ==true) {
    router.push('/maincontent');
  }
  } catch(e){
    console.log(e)
  }
  
}
const incorrectLogin = ref(false)
  function required(v: any) {
        return !!v || 'Field is required'
      }
  </script>
  