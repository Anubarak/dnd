<script setup
        lang="ts">

import {computed} from 'vue';

interface Props {
  modelValue?: string|null
  imageTitle?: string|null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  imageTitle: null,
})

const emit = defineEmits<{
  (e: 'update:model-value', data: string): void
  (e: 'update:image-title', data: string): void
}>();

const onFileChange = (files: File[]) => {
  const file = files[0] ?? null;
  if (!file) {
    emit('update:image-title', null);
    emit('update:model-value', null);
    return false;
  }

  const reader = new FileReader();
  reader.addEventListener(
    'load',
    () => {
      emit('update:image-title', file.name);
      emit('update:model-value', (reader.result) as string);
    },
    false,
  );

  reader.readAsDataURL(file);
};

const currentValue = computed(() => {
  if(!props.imageTitle){
    return []
  }

  return [new File(['foo'], props.imageTitle, {
    type: "text/plain",
  })]
})

</script>

<template>
  <v-file-input
    :model-value="currentValue"
    @update:model-value="onFileChange"
    :multiple="false"
    accept="image/*"
    prepend-icon=""
    label="Avatar"></v-file-input>
</template>

<style scoped>

</style>
