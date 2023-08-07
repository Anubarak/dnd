<template>
  <v-app v-if="loading">
    <v-main>
      <CenterStuff>
        <v-layout align-center
                  justify-center
                  column
                  fill-height>
            <v-progress-circular
              indeterminate
              color="primary"
              :size="99"
              :width="9"></v-progress-circular>
        </v-layout>
      </CenterStuff>
    </v-main>
  </v-app>
  <router-view v-else/>
</template>

<script lang="ts"
        setup>
import {computed, onMounted, ref} from 'vue';
import {useCharacterStore} from '@/store/characterStore';
import {useItemStore} from '@/store/itemStore';
import {showError} from '@/services/Utils';
import CenterStuff from '@/components/CenterStuff.vue';
import {useTheme} from 'vuetify';

const loading = ref(true);

const characterStore = useCharacterStore();
const itemStore = useItemStore();
onMounted(async () => {
  try {
    await Promise.all([
      characterStore.fetchCharacters(),
      itemStore.fetchItems(),
      itemStore.fetchItemTypes(),
      itemStore.fetchItemImages(),
    ]);
  } catch (err) {
    showError(err);
  } finally {
    loading.value = false;
  }
});


const {current} = useTheme();
const primaryCssColor = computed(() => current?.value?.colors?.primary);
</script>


<style>
a {
  text-decoration: none;
  color: inherit;
}

a.router-link-active {
  color: v-bind('primaryCssColor')
}

.character-expansion-panel .v-expansion-panel-text__wrapper {
  padding: 8px 1px 16px !important;
}

.padding-5px {
  padding-top: 5px;
  padding-bottom: 5px;
}

.padding-bottom-icon {
  padding-bottom: 15px;
}

.v-progress-circular {
  display: block;
  width: 100px;
  margin: 0 auto;
}
</style>
