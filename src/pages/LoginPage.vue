<template>
  <v-container
    style="display: flex; height: 20%; width: 100%; justify-content: center; flex-direction: row; align-items: center;">
    <img src="@/assets/snugeu_logo.jpg" />
  </v-container>
  <v-container
    style="display: flex; height: 50%; width: 100%; margin-top: 0px; justify-content: center; flex-direction: row; align-items: center; margin-top: 10%;">
    <v-card class="mx-auto px-6 py-8" style="width: 60%; min-width: 300px; max-width: 600px;">
      <v-form v-model="form" @submit.prevent="login">
        <v-text-field v-if="expandedForm" v-model="name" :readonly="loading" :rules="[required]" class="mb-2" clearable
          label="Name"></v-text-field>
        <v-text-field v-model="username" :readonly="loading" :rules="[required]" class="mb-2" clearable
          label="Email"></v-text-field>
        <v-text-field v-model="password" :readonly="loading" :rules="[required]" clearable type="password"
          label="Password" placeholder="Enter your password"></v-text-field>
        <v-text-field v-if="expandedForm" v-model="clientid" :readonly="loading" :rules="[required]" clearable
          label="Client ID" placeholder="Enter your airthings account ClientID"></v-text-field>
        <v-text-field v-if="expandedForm" v-model="clientsecret" :readonly="loading" :rules="[required]" clearable
          label="Clientsecret" placeholder="Enter your airthings account ClientSecret"></v-text-field>
        <v-text-field v-if="expandedForm" v-model="serialNumber" :readonly="loading" :rules="[required]" clearable
          label="Serialnumber" placeholder="Enter your airthings device SerialNumber"></v-text-field>
        <v-text-field type="number" v-if="expandedForm" v-model="priceLimit" :readonly="loading" :rules="[required]"
          clearable label="Price limit in NOK Øre"
          placeholder="Enter your desired pricelimit for electricity price"></v-text-field>
        <v-btn v-if="expandedForm" @click="displayWlFields = true">Add weatherlink station?</v-btn>
        <v-text-field v-if="displayWlFields" v-model="wlstation" placeholder="Weatherlink station ID"></v-text-field>
        <v-text-field v-if="displayWlFields" v-model="wlapikey" placeholder="Weatherlink api key"></v-text-field>
        <v-text-field v-if="displayWlFields" v-model="wlapisecret" placeholder="Weatherlink api secret"></v-text-field>
        <p v-if="incorrectLogin" style="color: red;">Incorrect email and/or password</p>
        <p v-else-if="missingDevice" style="color: red;">Incorrect email and/or password</p>
        <p v-else-if="userExists" style="color: red;">A user with this email is already registered <span
            style="text-decoration: underline; cursor: pointer" @click="expandForm"> Sign in instead</span></p>
        <br>
        <div v-if="!expandedForm">
          <p>First time? Sign up and register device <span style="text-decoration: underline; cursor: pointer;"
              @click="expandForm">here</span></p>
        </div>
        <v-checkbox v-if="expandedForm" v-model="skipCheck" label="Test User"></v-checkbox>
        <br>
        <v-btn v-if="!expandedForm" :disabled="!form" :loading="loading" block color="success" size="large"
          type="submit" variant="elevated">
          Sign In
        </v-btn>
        <v-btn v-else :disabled="!form" :loading="loading" block type="submit" color="success" size="large"
          variant="elevated">
          Sign Up
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getUserFromDB, getDeviceFromDB, addUserToDB, addDeviceToDB, createAccountToken, getDeviceInfo, getLocationInfo, getWeatherStationFromDB, addWeatherStationToDB, getLimitsFromDB, addLimitsToDB } from '@/utils/APIRequests'
import { useAppStore } from '@/store/app'
import { ref } from 'vue';
import { useLimitStore } from '@/store/valuestore';

const userStore = useAppStore()
const limitStore = useLimitStore();
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
const lat = ref(0)
const lng = ref(0)
const id = ref('')
const missingDevice = ref(false)
const userExists = ref(false);
const currentUser = userStore.User
const valueLimits = limitStore
const loggedIn = ref(false)
const displayWlFields = ref(false)
const wlstation = ref('')
const wlapikey = ref('')
const wlapisecret = ref('')
const priceLimit = ref(0)
async function getUser() {
  try {
    loading.value = true;
    const checkUser = await getUserFromDB(username.value)
    const user = checkUser.document
    if (user !== null) {
      if (user.username === username.value && user.userpw === password.value) {
        id.value = user._id
        const deviceData = await getDeviceFromDB(id.value)
        name.value = user.name
        username.value = user.username
        loggedIn.value = true
        clientid.value = deviceData.document.clientid
        clientsecret.value = deviceData.document.clientsecret
        serialNumber.value = deviceData.document.serialnumber
        lat.value = deviceData.document.lat
        lng.value = deviceData.document.lng
        const weatherStation = await getWeatherStationFromDB(id.value)
        if (weatherStation.document !== null) {
          currentUser.WeatherStation.Id = weatherStation.document.wlstationid
          currentUser.WeatherStation.ApiKey = weatherStation.document.wlapikey
          currentUser.WeatherStation.ApiSecret = weatherStation.document.wlapisecret
        }
        const userLimits = await getLimitsFromDB(id.value)
        if (userLimits.document !== null) {
          priceLimit.value = userLimits.document.pricelimit
        }
        router.push('/mainContent')
      } else {
        incorrectLogin.value = true
      }
    } else {
      incorrectLogin.value = true
    }
  } catch (e) {
    console.log(e)
  } finally {
    currentUser.Name = name.value
    currentUser.UserName = username.value
    currentUser.IsLoggedIn = loggedIn.value
    currentUser.UserId = id.value
    currentUser.ClientID = clientid.value
    currentUser.ClientSecret = clientsecret.value
    currentUser.SerialNumber = serialNumber.value
    currentUser.ClientLocation.Lat = lat.value
    currentUser.ClientLocation.Lng = lng.value
    valueLimits.PriceLimit = priceLimit.value
    if (loggedIn.value) {
      router.push('/mainContent')
    }
    loading.value = false;
  }
}
async function addUser() {
  try {
    userExists.value = false;
    loading.value = true;
    const checkUser = await getUserFromDB(username.value)
    if (checkUser.document !== null) {
      userExists.value = true
      return
    } else {
      const userAdd = await addUserToDB(username.value, password.value)
      userId.value = userAdd.insertedId
      if (!skipCheck.value) {
        const token = await createAccountToken(clientid.value, clientsecret.value)
        const deviceInfo = await getDeviceInfo(serialNumber.value, token.access_token)
        const locationInfo = await getLocationInfo(deviceInfo.location.id, token.access_token)
        lat.value = locationInfo.lat
        lng.value = locationInfo.lng
      }
      if (wlstation.value !== '') {
        await addWeatherStationToDB(userId.value, wlstation.value, wlapisecret.value, wlapikey.value)
      }
      await addLimitsToDB(userId.value, priceLimit.value)
      loggedIn.value = true
      await addDeviceToDB(userId.value, clientid.value, clientsecret.value, serialNumber.value, lat.value, lng.value)
    }
  } catch (e) {
    console.log(e)
  } finally {
    currentUser.Name = name.value
    currentUser.UserName = username.value
    currentUser.IsLoggedIn = loggedIn.value
    currentUser.UserId = userId.value
    currentUser.ClientID = clientid.value
    currentUser.ClientSecret = clientsecret.value
    currentUser.SerialNumber = serialNumber.value
    currentUser.ClientLocation.Lat = lat.value
    currentUser.ClientLocation.Lng = lng.value
    if (wlstation.value !== '') {
      currentUser.WeatherStation.Id = wlstation.value
      currentUser.WeatherStation.ApiKey = wlapikey.value
      currentUser.WeatherStation.ApiSecret = wlapisecret.value
    }
    valueLimits.PriceLimit = priceLimit.value
    if (currentUser.IsLoggedIn) {
      router.push('/mainContent')
    }
    loading.value = false;
  }
}
function expandForm() {
  if (expandedForm.value === true) {
    incorrectLogin.value = false
    missingDevice.value = false
    userExists.value = false
    expandedForm.value = false
  } else {
    incorrectLogin.value = false
    missingDevice.value = false
    expandedForm.value = true
  }
}
async function login() {
  if (expandedForm.value) {
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