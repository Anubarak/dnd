<script setup
        lang="ts">

import FileUpload from '@/components/FileUpload.vue';
import ImageSelect from '@/components/ImageSelect.vue';

interface Props {
  url: string | null,
  id: number | null
  imageTitle: string | null
}

withDefaults(defineProps<Props>(), {
  url: null,
  id: null,
  imageTitle: null
});

const emit = defineEmits<{
  (e: 'update:url', data: string | null): void,
  (e: 'update:id', data: number | null): void
  (e: 'update:image-title', data: string | null): void
}>();

</script>

<template>
  <v-row>
    <FileUpload
      :image-title="imageTitle"
      :model-value="url"
      @update:image-title="emit('update:image-title', $event)"
      @update:model-value="emit('update:url', $event)"/>
  </v-row>
  <v-row>
    <ImageSelect
      :disabled="url !== null && url.length !== 0"
      :model-value="id"
      @update:model-value="emit('update:id', $event)"
    ></ImageSelect>
  </v-row>
</template>

<style scoped>

</style>
