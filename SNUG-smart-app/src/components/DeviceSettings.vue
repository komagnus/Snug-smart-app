<template>
    <v-card
    title="Device settings"
    style="display: flex; flex-direction: column; align-items: center; width: 100%;">
    <v-btn style="display: flex; justify-content: space-evenly; width: 80%; margin: 1%;" @click="toggleAddNewDevice">
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
    <v-btn style="display: flex; justify-content: space-evenly; width: 80%; margin: 1%;" @click="toggleEditDevice" >
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
      <v-btn style="margin: 2%;" @click="updateDevice">Edit device</v-btn>
    </v-card>
    <v-btn style="display: flex; justify-content: space-evenly; width: 80%; margin: 1%;" >
      <v-icon icon="mdi-database-edit-outline" size="large"></v-icon>
      <div>Edit desired values</div>
    </v-btn>
  </v-card>
</template>
<script setup lang="ts">
import { addDeviceToDB, getLocationInfo, createAccountToken, getDeviceInfo, createDbAccountToken } from '@/utils/APIRequests';
import { ref } from 'vue';
const addNewDevice = ref(false)
const editDevice = ref(false)
const clientID = ref('')
const clientSecret = ref('')
const userId = ref('')
const lat = ref(0)
const lng = ref(0)
const serialNumber = ref('')
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
async function addDevice(){
  try{
    const token = await createAccountToken(clientID.value, clientSecret.value)
    const deviceInfo = await getDeviceInfo(serialNumber.value, token.access_token)
    const locationInfo = await getLocationInfo(deviceInfo.location.id, token.access_token)
    lat.value = locationInfo.lat
    lng.value = locationInfo.lng
    const getToken = await createDbAccountToken()
    const accessToken = getToken.access_token
    await addDeviceToDB(accessToken, userId.value, clientID.value, clientSecret.value, serialNumber.value, lat.value, lng.value)
  } catch(e) {
    console.log(e)
  }
} 

async function updateDevice () {
  console.log('editja')
}
</script>