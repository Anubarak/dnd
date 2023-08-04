<script setup
        lang="ts">

import {useItemStore} from '@/store/itemStore';
import {ref} from 'vue';
import {showError, showMessage} from '@/services/Utils';
import router from '@/router';
import DiceChip from '@/components/DiceChip.vue';
import {useDialog} from '@/compositions/DialogComposition';

const itemStore = useItemStore();

const deleteLoading = ref(0);

const deleteItem = async (id: number) => {
  if (!confirm('Sicher?')) {
    return false;
  }

  deleteLoading.value = id;
  try {
    await itemStore.deleteItem(id);
    showMessage('Gelöscht');
  } catch (err) {
    showError(err);
  } finally {
    deleteLoading.value = 0;
  }
};

const editItem = async (id: number) => {
  router.push({
    name: 'item-form',
    params: {id}
  })
};

const {openImage} = useDialog();
const searchString = ref('');
</script>

<template>
  <v-card>
    <v-card-text>
      <v-text-field
        v-model="searchString"
        label="Suche"
      ></v-text-field>
    </v-card-text>
  </v-card>

  <v-card
    v-for="(item, i) in itemStore.items.filter(el => !searchString || el.title.toLowerCase().includes(searchString.toLowerCase()))"
    :key="i">
    <v-card-title>
      <v-avatar
        size="50"
        @click="openImage(item.imageUrlLarge ?? item.imageUrl ?? '/placeholder.jpg')"
        :image="item.imageUrl ?? '/placeholder.jpg'"></v-avatar>
      {{ item.title }}
    </v-card-title>

    <v-card-subtitle>
        {{ item.description }}<br>
        <DiceChip
          v-for="(dice, index) in item.dices"
          :key="index"
          :clearable="false"
          :dice="dice">
        </DiceChip><br>
        <DiceChip
          v-for="(dice, index) in item.specialDices"
          :key="index"
          :clearable="false"
          :dice="dice">
        </DiceChip>

    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        @click="deleteItem(item.id)"
        :loading="deleteLoading === item.id"
        size="small"
        icon="mdi-trash-can"
        color="primary"
      ></v-btn>

      <v-btn
        @click="editItem(item.id)"
        size="small"
        icon="mdi-cog"
        color="primary"
      ></v-btn>
    </v-card-actions>
    <v-divider/>
  </v-card>
</template>

<style scoped>

</style>
