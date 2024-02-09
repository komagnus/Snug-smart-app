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
        @submit.prevent="login"
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
        <v-text-field
          v-if="expandedForm"
          v-model="serialNumber"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="Serialnumber"
          placeholder="Enter your airthings device SerialNumber"
        ></v-text-field>
        <p v-if="incorrectLogin" style="color: red;">Incorrect email and/or password</p>
        <p v-else-if="missingDevice" style="color: red;">Incorrect email and/or password</p>
        <br>
        <div v-if="!expandedForm">
          <p >First time? Sign up and register device <span style="text-decoration: underline; cursor: pointer;" @click="expandForm">here</span></p>
        </div>
          <v-checkbox v-if="expandedForm" v-model="skipCheck" label="Test User"></v-checkbox>
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
          type="submit"
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
  //import { getUserFromDB, getDeviceFromDB, addUserToDB, addDeviceToDB, createAccountToken, getDeviceInfo, getLocationInfo } from '@/utils/APIRequests'
  import { getUserFromDB, addUserToDB, addDeviceToDB, createAccountToken, getDeviceFromDB, DbDeviceInfo, getLocationInfo, getDeviceInfo } from '@/utils/APIRequests'
  import { useAppStore } from '@/store/app'


import { ref } from 'vue';
import { customRef } from 'vue';
const router = useRouter();
const username = ref('')
const password = ref('')
const clientid = ref('')
const clientsecret = ref('')
const serialNumber = ref('')
const name = ref('')
const form = ref(false)
const loading = ref(false)
const expandedForm = ref(false)
const skipCheck = ref(false)
const userId = ref('')
const userStore = useAppStore()
const lat = ref(0)
const lng = ref(0)
const id = ref('')
const missingDevice = ref(false)
const currentUser = userStore.User
const loggedIn = ref(false)
async function getUser() {
try{
  loading.value = true;
  const checkUser = await getUserFromDB()
  checkUser.forEach((user: {_id: string; name: string; username: string; userpw: string;}) => {
    if(user.username === username.value && user.userpw === password.value) {
      id.value = user._id
      name.value = user.name
      username.value = user.username
      loggedIn.value = true
    } else {      
      incorrectLogin.value = true
    }
  });
  const deviceData = await getDeviceFromDB()
  deviceData.forEach((device: DbDeviceInfo) => {
    if(device.userid === id.value) {
      clientid.value = device.clientid
      clientsecret.value = device.clientsecret
      serialNumber.value = device.serialnumber
      lat.value = device.lat
      lng.value = device.lng
    } else {
      missingDevice.value = true
    }
  });
  } catch(e){
    console.log(e)
  } finally {
    currentUser.Name = name.value
    currentUser.UserName = username.value
    currentUser.IsLoggedIn = loggedIn.value
    currentUser.ClientID = clientid.value
    currentUser.ClientSecret = clientsecret.value
    currentUser.SerialNumber = serialNumber.value
    currentUser.ClientLocation.Lat = lat.value
    currentUser.ClientLocation.Lng = lng.value
    if(loggedIn.value) {
      router.push('/mainContent')
    }
    loading.value = false;
  }
}

async function addUser() {
  try {
    loading.value = true;
    await addUserToDB(name.value, username.value, password.value)
    if(!skipCheck.value){
      const token = await createAccountToken(clientid.value, clientsecret.value)
      const checkUser = await getUserFromDB()
      checkUser.forEach((user: {_id: string; name: string; username: string; userpw: string;}) => {
        if(user.username === username.value && user.userpw === password.value) {
          id.value = user._id
          loggedIn.value = true
        }
      });
      const deviceInfo = await getDeviceInfo(serialNumber.value, token.access_token)
      const locationInfo = await getLocationInfo(deviceInfo.location.id, token.access_token)
      lat.value = locationInfo.lat
      lng.value = locationInfo.lng
    }
    
    await addDeviceToDB(id.value, clientid.value, clientsecret.value, serialNumber.value, lat.value, lng.value)
  } catch(e) {
    console.log(e)
  } finally {
    currentUser.Name = name.value
    currentUser.UserName = username.value
    currentUser.IsLoggedIn = loggedIn.value
    currentUser.ClientID = clientid.value
    currentUser.ClientSecret = clientsecret.value
    currentUser.SerialNumber = serialNumber.value
    currentUser.ClientLocation.Lat = lat.value
    currentUser.ClientLocation.Lng = lng.value
    if(loggedIn.value) {
      router.push('/mainContent')
    }    
    loading.value = false;
  }

}

/*async function getUser() {
try{
  loading.value = true;
  const checkUser = await getUserFromDB(username.value)
    if(checkUser.document !== null) {
      if(checkUser.document.username === username.value && checkUser.document.userpw === password.value) {
        console.log(checkUser.document)
        const deviceData = await getDeviceFromDB(checkUser.document._id)
        const user = userStore.User
        user.Name = name.value
        user.UserName = username.value
        user.IsLoggedIn = true
        user.ClientID = deviceData.document.clientid
        user.ClientSecret = deviceData.document.clientsecret
        user.SerialNumber = deviceData.document.serialnumber
        router.push('/mainContent')
      } else {
      incorrectLogin.value = true
    }
    } else {
      incorrectLogin.value = true
    }
  
  } catch(e){
    console.log(e)
  } finally {
    loading.value = false;
  }
}
async function addUser() {
  try {
    loading.value = true;
    const userAdd = await addUserToDB(username.value, password.value)
    console.log(userAdd)
    userId.value = userAdd.insertedId
    console.log(userId.value)
    console.log(clientid.value)
    console.log(clientsecret.value)
    if(!skipCheck.value){
      const token = await createAccountToken(clientid.value, clientsecret.value)
      const deviceInfo = await getDeviceInfo(serialNumber.value, token.access_token)
      const locationInfo = await getLocationInfo(deviceInfo.location.id, token.access_token)
      lat.value = locationInfo.lat
      lng.value = locationInfo.lng
    }
    const user = userStore.User
    user.Name = name.value
    user.UserName = username.value
    user.ClientID = clientid.value
    user.ClientSecret = clientsecret.value
    user.ClientLocation.Lat = lat.value
    user.ClientLocation.Lng = lng.value
    user.SerialNumber = serialNumber.value
    await addDeviceToDB(userId.value, clientid.value, clientsecret.value, serialNumber.value, lat.value, lng.value)
  } catch(e) {
    console.log(e)
  } finally {
    router.push('/mainContent')
    loading.value = false;
  }
} */
function expandForm() {
  if(expandedForm.value) {
    expandedForm.value = false
  } else {
    incorrectLogin.value = false
    missingDevice.value = false
    expandedForm.value = true 
  }
}
async function login() {
  if(expandedForm.value) {
    await addUser()
  } else {
    await getUser()
  }
}
const incorrectLogin = ref(false)
  function required(v: any) {
        return !!v || 'Field is required'
      }
</script>
  