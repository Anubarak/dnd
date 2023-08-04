<script setup
        lang="ts">
import {MenuItem} from '@/Types';
import {ref} from 'vue';
import {showError, showMessage} from '@/services/Utils';
import {useCharacterStore} from '@/store/characterStore';
import {useRouter} from 'vue-router';

interface Props {
  item: MenuItem
}

const characterStore = useCharacterStore();
const props = defineProps<Props>();
const loading = ref(false);
const deleteItem = async (e: PointerEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if(!props.item.id){
    return false;
  }

  if (!confirm('Sicher?')) {
    return false;
  }

  loading.value = true;
  try {
    await characterStore.deleteCharacter(props.item.id);
    showMessage('Char wurde gelöscht');
  } catch (err) {
    console.log(err);
    showError('Fehler beim löschen');
  } finally {
    loading.value = false;
  }
};

const router = useRouter();
const routeTo = () => {
  router.push(props.item.route);
}

</script>

<template>
  <RouterLink :to="item.route">
    <v-list-item
      :value="item"
      color="primary"
    >
      <template v-slot:prepend>
        <v-avatar v-if="item.avatar"
                  size="25"
                  style="margin-right: 31px;"
                  :image="item.avatar">

        </v-avatar>
        <v-icon v-else-if="item.icon"
                :icon="item.icon"></v-icon>
      </template>

      <v-list-item-title>
        {{ item.title }}

        <div style="float:right">
          <v-btn
            v-if="item.type === 'char' && item.id"
            :loading="loading"
            color="primary"
            @click="deleteItem"
            size="x-small"
            icon="mdi-trash-can"
          ></v-btn>
        </div>

      </v-list-item-title>

      <v-divider v-if="item.divider" />
    </v-list-item>
  </RouterLink>

</template>

<style scoped>

</style>
