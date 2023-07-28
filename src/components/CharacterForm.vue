<script setup
        lang="ts">

import {ref} from 'vue';
import {Character} from '@/Types';
import {showError, showMessage} from '@/services/Utils';
import {useRouter} from 'vue-router';
import CharacterPreview from '@/views/Character.vue';
import {useCharacterStore} from '@/store/characterStore';

interface Props {
  isEnemy: boolean,
  redirect: boolean,
  id?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  redirect: true,
  id: null,
});

const reset = (): Character => ({
  id: null,
  name: '',
  description: '',
  hp: null,
  mp: null,
  currentMp: 10,
  currentHp: 10,
  imageUrl: '',
  xp: 0,
  isEnemy: props.isEnemy,
  isTemplate: props.isEnemy,
  kills: 0,
  items: []
});

const characterStore = useCharacterStore();
const c = props.id? characterStore.characters.find(el => el.id === props.id) || null : null;
const char = ref<Character & {id: number|null}>( c? {...c} : reset());

const loading = ref(false);
const router = useRouter();
const onSubmit = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    const res = await characterStore.saveCharacter(char.value);
    showMessage(`${res.name} erfolgreich gespeichert`);

    if (props.redirect) {
      router.push({name: 'character', params: {id: res.id}});
    } else {
      char.value = reset();
    }
  } catch (err) {
    showError(err);
  } finally {
    loading.value = false;
  }
};


const onFileChange = (files: File[]) => {
  const file = files[0] ?? null;
  if (!file) {
    char.value.imageUrl = '';
    return false;
  }

  const reader = new FileReader();
  reader.addEventListener(
    'load',
    () => {
      char.value.imageUrl = (reader.result) as string;
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
          v-if="char.id === null"
          @update:model-value="onFileChange"
          :multiple="false"
          accept="image/*"
          prepend-icon=""
          label="Avatar"></v-file-input>
      </v-row>
      <v-row>
        <v-text-field
          v-model="char.name"
          label="Name"
          required
        ></v-text-field>
      </v-row>

      <v-row>
        <v-text-field
          v-model="char.description"
          label="Beschreibung"
          required
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          v-model="char.hp"
          label="HP"
          type="number"
          required
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          v-model="char.mp"
          label="MP"
          type="number"
          required
        ></v-text-field>
      </v-row>
      <v-btn
        :loading="loading"
        type="submit"
        color="primary"
        block
        class="mt-2"
        text="Absenden"
      ></v-btn>
    </v-container>
  </v-form>

  <CharacterPreview
    :allow-edit="false"
    :character="char"></CharacterPreview>
</template>

<style scoped>

</style>
