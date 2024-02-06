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
        <v-text-field
          v-if="expandedForm"
          v-model="clientid"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="Client ID"
          placeholder="Enter your airthings account ClientID"
        ></v-text-field>
        <v-text-field
          v-if="expandedForm"
          v-model="clientsecret"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="Clientsecret"
          placeholder="Enter your airthings account ClientSecret"
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
          @click="getUser"
          variant="elevated"
        >
          Sign In
        </v-btn>
        <v-btn
        v-else
          :disabled="!form"
          :loading="loading"
          block
          @click="addUser"
          color="success"
          size="large"
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
  import { getUserFromDB, addUserToDB, addDeviceToDB, createAccountToken } from '@/utils/APIRequests'
import { ref } from 'vue';
const router = useRouter();
const username = ref('')
const password = ref('')
const clientid = ref('')
const clientsecret = ref('')
const serialNumber = ref('')
const name = ref('')
const airthingsUsername = ref('')
const airthingsPassword = ref('')
const form = ref(false)
const loading = ref(false)
const expandedForm = ref(false)
const deviceSerialNumber = ref('')
async function getUser() {
try{
  loading.value = true;
  const checkUser = await getUserFromDB()
  checkUser.data.forEach((user: {userid: string; username: string; userpw: string;}) => {
    if(user.username === username.value && user.userpw === password.value) {
      router.push('/mainContent')
    } else {
      incorrectLogin.value = true
    }
  });
  console.log(checkUser.data);
  } catch(e){
    console.log(e)
  } finally {
    loading.value = false;
  }
}

async function addUser() {
  try {
    loading.value = true;
    await addUserToDB(username.value, password.value)
    const token = await createAccountToken(clientid.value, clientsecret.value)
    //add function to select the device you want to use
    await addDeviceToDB(clientid.value, clientsecret.value, serialNumber.value)
  } catch(e) {
    console.log(e)
  } finally {
    loading.value = false;
  }

}
const incorrectLogin = ref(false)
  function required(v: any) {
        return !!v || 'Field is required'
      }
  </script>
  