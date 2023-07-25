<template>
  <v-app>

    <v-navigation-drawer v-model="drawer">
      <MenuContent />
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>DnD</v-toolbar-title>
    </v-app-bar>

    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultView from './View.vue'
  import { ref } from 'vue'
  import MenuContent from '@/layouts/default/MenuContent.vue';

  const drawer = ref(false)
</script>
