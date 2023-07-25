<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title class="text-h6">
        Goteishi DnD
      </v-list-item-title>
      <v-list-item-subtitle>
        Characters
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>

  <v-divider></v-divider>

  <v-list
    dense
    nav
  >
    <v-list-item
      v-for="item in items"
      :key="item.title"
      link
    >
      <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>

const items = [
  { title: 'Sarah', icon: 'mdi-view-dashboard' },
  { title: 'Marcel', icon: 'mdi-image' },
  { title: 'usw', icon: 'mdi-help-box' },
];
</script>

<style scoped>

</style>
