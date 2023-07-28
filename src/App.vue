<template>
  <v-app v-if="loading">
    <v-main>
      <CenterStuff>
        <v-progress-circular
          indeterminate
          color="primary"
          :size="99"
          :width="9"></v-progress-circular>
      </CenterStuff>
    </v-main>
  </v-app>
  <router-view v-else/>
</template>

<script lang="ts"
        setup>
import {onMounted, ref} from 'vue';
import {useCharacterStore} from '@/store/characterStore';
import {useItemStore} from '@/store/itemStore';
import {showError} from '@/services/Utils';
import CenterStuff from '@/components/CenterStuff.vue';

const loading = ref(true);

const characterStore = useCharacterStore();
const itemStore = useItemStore();
onMounted(async () => {
  try {
    await Promise.all([characterStore.fetchCharacters(), itemStore.fetchItems()]);
  } catch (err) {
    showError(err);
  } finally {
    loading.value = false;
  }


});
</script>


<style>
a {
  text-decoration: none;
  color: inherit;
}

.character-expansion-panel .v-expansion-panel-text__wrapper {
  padding: 8px 1px 16px !important;
}
</style>
