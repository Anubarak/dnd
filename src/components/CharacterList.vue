<script setup
        lang="ts">

import {useCharacterStore} from '@/store/characterStore';
import Character from '@/views/Character.vue';
import {computed, ref} from 'vue';

interface Props {
  type: 'hero' | 'enemy' | 'templates',
  avatarSize: number
}

const props = defineProps<Props>();

const characterStore = useCharacterStore();
const panel = ref<number[]>([]);


const chars = computed(() => {

  switch (props.type) {
    case 'enemy':
      return characterStore.enemies;
    case 'hero':
      return characterStore.heros;
    case 'templates':
      return characterStore.enemyTemplates;
  }
});

const all = () => {
  panel.value = chars.value.map(el => el.id as number);
}

const none = () => {
  panel.value = []
}
</script>

<template>
  <div class="text-center d-flex pb-4">
    <v-btn class="ma-2" @click="all">
      Alle ausklappen
    </v-btn>
    <v-btn class="ma-2" @click="none">
      Alle einfahren
    </v-btn>
  </div>
  <v-expansion-panels
    v-model="panel"
    multiple
  >
    <v-expansion-panel
      v-for="char in chars"
      :key="char.id as number"
      :value="char.id">
      <v-expansion-panel-title>
        <v-sheet class="d-flex flex-wrap" style="width: 100%;">
          <v-sheet class="flex-1-0 ma-2 pa-2">
            {{ char.name }}
          </v-sheet>
          <v-sheet class="ma-2 pa-2">
            <v-icon icon="mdi-heart"></v-icon>
            {{ char.currentHp }} / {{ char.hp }}
          </v-sheet>
        </v-sheet>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="character-expansion-panel">
        <Character
          :avatar-size="avatarSize"
          :allow-edit="true"
          :edit-xp="true"
          :character="char"
        ></Character>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
.v-expansion-panel-title {
  padding-bottom: 0px;
  padding-top: 0px;
}
</style>
