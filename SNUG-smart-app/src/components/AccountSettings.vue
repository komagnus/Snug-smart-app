<template>
    <v-expansion-panel
    title="Account"
    >
    <v-list>
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
    </v-expansion-panel>
</template>
<script setup lang="ts">
const items = [
    { text: 'Edit account', icon: 'mdi-account' },
    { text: 'Log out', icon: 'mdi-logout' },
]
</script>