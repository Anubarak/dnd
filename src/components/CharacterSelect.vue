<script setup
        lang="ts">

import {Character} from '@/Types';
import {useCharacterStore} from '@/store/characterStore';

interface Props {
  modelValue: number|null,
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:model-value', value: number|null): void,
}>()

const characterStore = useCharacterStore();

</script>

<template>
  <v-select
    :model-value="modelValue"
    @update:model-value="emit('update:model-value', $event)"
    ref="autoComplete"
    item-title="name"
    item-value="id"
    clearable
    label="Character auswählen"
    :items="characterStore.heros"
    variant="solo"
  >
    <template v-slot:item="{ props, item }: {props: any, item: {raw: Character}}">
      <v-list-item
        v-bind="props"
        :prepend-avatar="item?.raw?.imageUrl"
        :title="item?.raw?.name"
      ></v-list-item>
    </template>
  </v-select>
</template>

<style scoped>

</style>
