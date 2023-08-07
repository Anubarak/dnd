<script setup
        lang="ts">
import CharacterList from '@/components/CharacterList.vue';
import {ref} from 'vue';
import {useCharacterStore} from '@/store/characterStore';
import {showError, showMessage} from '@/services/Utils';

const selectedCharacterId = ref(null);
const characterStore = useCharacterStore();
const title = ref();
const loading = ref(false);
const addEnemy = async () => {

  if (!selectedCharacterId.value) {
    showError('Feind wählen (╯°□°）╯︵ ┻━┻)');
    return;
  }

  loading.value = true;

  try {
    await characterStore.createEnemyFromTemplate(selectedCharacterId.value, title.value);

    title.value = '';
    selectedCharacterId.value = null;
    showMessage('Hinzugefügt');
  } catch (err) {
    showError(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-container>

    <h3>Helden</h3>
    <CharacterList
      :avatar-size="50"
      :type="'hero'"></CharacterList>

    <h3>Gegner</h3>
    <CharacterList
      :avatar-size="50"
      :type="'enemy'"></CharacterList>

    <v-select
      v-model="selectedCharacterId"
      item-title="name"
      item-value="id"
      clearable
      label="Gegner hinzufügen"
      :items="characterStore.enemyTemplates"
      variant="solo"
    ></v-select>
    <v-text-field
      v-model="title"
      label="Alternativer Name"
    ></v-text-field>
    <v-btn
      @click="addEnemy"
      :loading="loading"
      size="small"
      color="primary"
    >Gegner Hinzufügen
    </v-btn>


  </v-container>

</template>

<style scoped>

</style>
