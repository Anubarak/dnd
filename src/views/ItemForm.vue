<script setup
        lang="ts">

import {computed, ref, watch} from 'vue';
import {Item, NewItem} from '@/Types';
import {useItemStore} from '@/store/itemStore';
import {showError, showMessage} from '@/services/Utils';
import WeaponList from '@/components/WeaponList.vue';
import {useRoute} from 'vue-router';
import DiceSelect from '@/components/DiceSelect.vue';
import AvatarInput from '@/components/AvatarInput.vue';
import {useDialog} from '@/compositions/DialogComposition'
const route = useRoute();
const itemId = computed(() => {
  const id = route.params.id;
  return id ? Number.parseInt(id as string) : null;
});

watch(itemId, () => {
  item.value = getLocalItem();
});

const itemStore = useItemStore();
const loading = ref(false);


const newItem = (): NewItem => ({
  id: null,
  title: '',
  description: '',
  imageUrl: '',
  imageUrlLarge: '',
  hp: 8,
  dices: [],
  specialDices: [],
  type: 'weapon',
  manaCostWizzard: 3,
  manaCostSupport: 3,
});
const getLocalItem = (): NewItem => {
  const c = itemId.value ? (itemStore.items.find(el => el.id === itemId.value) || null) : null;

  return c ? {...c as NewItem} : newItem();
};

const item = ref<NewItem>(getLocalItem());

const onSubmit = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    const res = await itemStore.saveItem(item.value as Item);
    showMessage(`${res.title} erfolgreich gespeichert`);
    item.value = newItem();
  } catch (err) {
    showError(err);
  } finally {
    loading.value = false;
  }
};

const {openImage} = useDialog();
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-container>
      <AvatarInput
        v-model:image-title="item.imageTitle"
        v-model:id="item.imageId"
        v-model:url="item.imageUrl"
      ></AvatarInput>

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
      <v-row>
        <v-select
          v-model="item.type"
          item-title="name"
          item-value="id"
          clearable
          label="Typ"
          :items="itemStore.itemTypes"
          variant="solo"
        ></v-select>
      </v-row>

      <template v-if="item.type === 'spell'">
        <v-row>
          <v-text-field
            v-model="item.manaCostWizzard"
            label="Manakosten Zauberer"
            type="number"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            v-model="item.manaCostSupport"
            label="Manakosten Support"
            type="number"
          ></v-text-field>
        </v-row>
      </template>
      <v-row>
        <DiceSelect
          title="Würfel"
          v-model="item.dices"/>
      </v-row>

      <v-row>
        <DiceSelect
          title="Mächtiger Angriff"
          v-model="item.specialDices"/>
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
            @click="openImage(item.imageUrl ?? '/placeholder.jpg')"
            :image="item.imageUrl ?? '/placeholder.jpg'"></v-avatar>
          {{ item.title }}
        </v-card-title>

        <v-card-subtitle>
          {{ item.description }}
        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>

  <v-container style="padding-bottom: 30px">
    <v-row>
      <v-expansion-panels>
        <v-expansion-panel
          title="Items">
          <v-expansion-panel-text>
            <WeaponList/>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
