<template>
    <v-card
    title="Account Settings"
    style="display: flex; flex-direction: column; align-items: center; width: 100%;">
    <v-btn :disabled="true" style="display: flex; justify-content: space-evenly; width: 80%; margin: 1%;" @click="toggleEditAccount" >
      <v-icon icon="mdi-account" size="large"></v-icon>
      <div>Edit Account</div>
    </v-btn>
    <v-card v-if="showEditAccountFields" style="display: flex; flex-direction: column; align-items: center; width: 80%;">
      <v-text-field
      v-model="username"
      label="Username"
      required
      hide-details
      style="width: 100%;">
      </v-text-field>
      <v-text-field
      v-model="oldPw"
      label="Current password"
      required
      hide-details
      style="width: 100%;">
      </v-text-field>
      <v-text-field
      v-model="newPw"
      label="New password"
      required
      hide-details
      style="width: 100%;">
      </v-text-field>
      <p v-if="wrongOldPw" style="color:red">Current password doesnt match</p>
      <v-btn style="margin: 2%;" @click="editAccount">Edit account</v-btn>
      </v-card>
    <v-btn style="display: flex; justify-content: space-evenly; width: 80%; margin: 1%;" @click="signOut" >
      <v-icon icon="mdi-logout" size="large"></v-icon>
      <div>Sign out</div>
    </v-btn>
    </v-card>
</template>
<script setup lang="ts">
import router from '@/router';
import { editUserInDB, getUserFromDB} from '@/utils/APIRequests'
import { useAppStore } from '@/store/app';
import { ref } from 'vue'
const userStore = useAppStore()
const showEditAccountFields = ref(false)
const username = ref(userStore.User.UserName)
const newPw = ref('')
const oldPw = ref('')
const userId = userStore.User.UserId
const wrongOldPw = ref(false)
function toggleEditAccount() {
  if(showEditAccountFields.value === false) {
    showEditAccountFields.value = true
  } else {
    showEditAccountFields.value = false
  }
}

function signOut() {
  userStore.User.IsLoggedIn = false
  router.push('/')
}

async function editAccount () {
  try {
    const checkUser = await getUserFromDB(userStore.User.UserName)
    if(checkUser.document.userpw === oldPw.value) {
      await editUserInDB(userId, username.value, newPw.value)
      userStore.User.UserName = username.value
    } else {
      wrongOldPw.value = true
    }
  } catch (e) {
    console.log(e)
  }
}
</script>