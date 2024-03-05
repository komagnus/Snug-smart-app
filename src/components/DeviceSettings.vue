<template>
    <v-card
    title="Device settings"
    style="display: flex; flex-direction: column; align-items: center; width: 100%;">
    <v-btn :disabled="true" style="display: flex; justify-content: space-evenly; width: 80%; margin: 1%;" @click="toggleAddNewDevice">
      <v-icon icon="mdi-server-plus" size="large"></v-icon>
      <div>Add Device</div>
    </v-btn>
    <v-card v-if="addNewDevice" style="display: flex; flex-direction: column; align-items: center; width: 80%;">
      <v-text-field
      v-model="clientID"
      label="Client ID"
      required
      hide-details
      style="width: 100%;">
      </v-text-field>
      <v-text-field
      v-model="clientSecret"
      label="Client Secret"
      required
      hide-details
      style="width: 100%;">
      </v-text-field>
      <v-text-field
      v-model="serialNumber"
      label="Serialnumber"
      required
      hide-details
      style="width: 100%;">
      </v-text-field>
      <v-btn style="margin: 2%;" @click="addDevice">Add device</v-btn>
    </v-card>
    <v-btn :disabled="true" style="display: flex; justify-content: space-evenly; width: 80%; margin: 1%;" @click="toggleEditDevice" >
      <v-icon icon="mdi-access-point-network" size="large"></v-icon>
      <div>Edit Device</div>
    </v-btn>
    <v-card v-if="editDevice" style="display: flex; flex-direction: column; align-items: center; width: 80%;">
      <v-text-field
      v-model="clientID"
      label="Client ID"
      required
      hide-details
      style="width: 100%;">
      </v-text-field>
      <v-text-field
      v-model="clientSecret"
      label="Client Secret"
      required
      hide-details
      style="width: 100%;">
      </v-text-field>
      <v-text-field
      v-model="serialNumber"
      label="Serialnumber"
      required
      hide-details
      style="width: 100%;">
      </v-text-field>
      <v-btn style="margin: 2%;" @click="updateDevice" :loading="loading">Edit device</v-btn>
    </v-card>
    <v-btn :disabled="true" style="display: flex; justify-content: space-evenly; width: 80%; margin: 1%;" @click="toggleEditValues" >
      <v-icon icon="mdi-database-edit-outline" size="large"></v-icon>
      <div>Edit desired values</div>
    </v-btn>
    <v-card v-if="editValues" style="display: flex; flex-direction: column; align-items: center; width: 80%;">
      <v-text-field
      type="number"
      v-model="pricelimit"
      label="Price limit for electricity in Øre"
      required
      hide-details
      style="width: 100%;">
      </v-text-field>
      <v-btn style="margin: 2%;" @click="updateValueLimits" :loading="loading">Update limit values</v-btn>
    </v-card>
  </v-card>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { useLimitStore } from '@/store/valuestore';
import { addDeviceToDB, getLocationInfo, createAccountToken, getDeviceInfo, editDeviceInDB, editLimitsInDB } from '@/utils/APIRequests';
import { ref } from 'vue';
const addNewDevice = ref(false)
const editDevice = ref(false)
const editValues = ref(false)
const clientID = ref('')
const clientSecret = ref('')
const limits = useLimitStore()
const pricelimit = ref(limits.PriceLimit)
const userId = ref('')
const lat = ref(0)
const lng = ref(0)
const loading = ref(false)
const serialNumber = ref('')
const user = useAppStore().User
function toggleAddNewDevice() {
  if(addNewDevice.value === false) {
    addNewDevice.value = true
  } else {
    addNewDevice.value = false
  }
}
function toggleEditDevice() {
  if(editDevice.value === false) {
    editDevice.value = true
  } else {
    editDevice.value = false
  }
}
function toggleEditValues() {
  if(editValues.value === false) {
    editValues.value = true
  } else {
    editValues.value = false
  }
}
async function addDevice(){
  try{
    loading.value = true
    const token = await createAccountToken(clientID.value, clientSecret.value)
    const deviceInfo = await getDeviceInfo(serialNumber.value, token.access_token)
    const locationInfo = await getLocationInfo(deviceInfo.location.id, token.access_token)
    lat.value = locationInfo.lat
    lng.value = locationInfo.lng
    await addDeviceToDB(userId.value, clientID.value, clientSecret.value, serialNumber.value, lat.value, lng.value)
  } catch(e) {
    console.log(e)
  } finally {
    loading.value = false
  }
} 

async function updateDevice () {
  try {
    loading.value = true
    await editDeviceInDB( user.UserId, clientID.value, clientSecret.value, serialNumber.value, lat.value, lng.value)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
async function updateValueLimits () {
  try {
    loading.value = true
    clientID.value = user.ClientID
    clientSecret.value = user.ClientSecret
    await editLimitsInDB(user.UserId, pricelimit.value)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
</script>
