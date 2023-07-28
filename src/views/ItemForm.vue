<script setup
        lang="ts">

import {ref} from 'vue';
import {Item} from '@/Types';
import {useItemStore} from '@/store/itemStore';
import {showError, showMessage} from '@/services/Utils';

const itemStore = useItemStore();
const loading = ref(false);
const item = ref<Item>({
  id: null,
  title: '',
  description: '',
  imageUrl: '',
  hp: 0
});

const onSubmit = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    const res = await itemStore.saveItem(item.value as Item);
    showMessage(`${res.title} erfolgreich gespeichert`);
  } catch (err) {
    showError(err);
  } finally {
    loading.value = false;
  }
};

const onFileChange = (files: File[]) => {
  const file = files[0] ?? null;
  if (!file) {
    item.value.imageUrl = '';
    return false;
  }

  const reader = new FileReader();
  reader.addEventListener(
    'load',
    () => {
      item.value.imageUrl = (reader.result) as string;
    },
    false,
  );

  reader.readAsDataURL(file);
};

</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-container>
      <v-row>
        <v-file-input
          @update:model-value="onFileChange"
          :multiple="false"
          accept="image/*"
          prepend-icon=""
          label="Avatar"></v-file-input>
      </v-row>

      <v-row>
        <v-text-field
          v-model="item.title"
          label="Name"
          required
        ></v-text-field>
      </v-row>

      <v-row>
        <v-text-field
          v-model="item.description"
          label="Beschreibung"
          required
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          v-model="item.hp"
          label="Standardnutzungen"
          type="number"
          required
        ></v-text-field>
      </v-row>

      <v-btn
        :loading="loading"
        type="submit"
        color="primary"
        class="mt-2"
        text="Absenden"
      ></v-btn>
    </v-container>
  </v-form>

  <v-row>
    <v-col>
      <v-card>
        <v-card-title>
          <v-avatar
            size="50"
            :image="item.imageUrl ?? '/placeholder.jpg'"></v-avatar>
          {{ item.title }}
        </v-card-title>

        <v-card-subtitle>
          {{ item.description }}
        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
