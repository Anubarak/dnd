<script setup
        lang="ts">

import {ref} from 'vue';
import {Character, NewCharacter} from '@/Types';
import {showError, showMessage} from '@/services/Utils';
import {useRouter} from 'vue-router';
import CharacterPreview from '@/views/Character.vue';
import {useCharacterStore} from '@/store/characterStore';
import AvatarInput from '@/components/AvatarInput.vue';


interface Props {
  isEnemy: boolean,
  redirect: boolean,
  id?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  redirect: true,
  id: null,
});

const reset = (): NewCharacter => ({
  id: null,
  name: '',
  description: '',
  hp: null,
  mp: null,
  armor: 2,
  movement: 2,
  currentMp: 10,
  currentHp: 10,
  imageId: null,
  imageUrl: '',
  imageUrlLarge: '',
  xp: 0,
  isEnemy: props.isEnemy,
  isTemplate: props.isEnemy,
  kills: 0,
  items: []
});

const characterStore = useCharacterStore();
const c = props.id? characterStore.characters.find(el => el.id === props.id) || null : null;
const char = ref<NewCharacter>( c? {...c} : reset());

const loading = ref(false);
const router = useRouter();
const onSubmit = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    const res = await characterStore.saveCharacter(char.value as Character);
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

</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-container>
      <AvatarInput
        v-model:image-title="char.imageTitle"
        v-model:id="char.imageId"
        v-model:url="char.imageUrl"
      ></AvatarInput>
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
      <v-row>
        <v-text-field
          v-model="char.armor"
          label="Rüstung"
          type="number"
          required
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          v-model="char.movement"
          label="Bewegung"
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
    :character="char as Character"></CharacterPreview>
</template>

<style scoped>

</style>
