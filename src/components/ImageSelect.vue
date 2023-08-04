<script setup
        lang="ts">

import {ItemImage} from '@/Types';
import {useItemStore} from '@/store/itemStore';

interface Props {
  modelValue?: number|null
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: null,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:model-value', value: number|null): void
}>();

const itemStore = useItemStore();

</script>

<template>
  <v-autocomplete
    :disabled="disabled"
    :model-value="modelValue"
    @update:model-value="emit('update:model-value', $event)"
    ref="autoComplete"
    item-title="title"
    item-value="id"
    clearable
    label="Bild auswählen"
    :items="itemStore.itemImages"
    variant="solo"
  >
    <template v-slot:item="{ props, item }: {props: any, item: {raw: ItemImage}}">
      <v-list-item
        v-bind="props"
        :prepend-avatar="item?.raw?.url"
        :title="item?.raw?.title"
      ></v-list-item>
    </template>
  </v-autocomplete>
</template>

<style scoped>

</style>
