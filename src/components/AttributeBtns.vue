<script setup
        lang="ts">
interface Props {
  name?: string|null,
  min: number
  max?: number | null
  loading: boolean,
  allowEdit?: boolean
  icon?: string|null
}

withDefaults(defineProps<Props>(), {
  max: null,
  allowEdit: true,
  name: null,
  icon: null
});

const cols = 3;

const emit = defineEmits<{
  (e: 'update', value: number): void
  (e: 'click:value', event: PointerEvent): void
}>();


const openSlider = async (event: PointerEvent) => {
  event.stopPropagation();
  event.preventDefault();

  emit('click:value', event);
}

</script>

<template>
  <v-col
    :cols="cols">
    {{ name }}

    <v-icon v-if="icon" :icon="icon"></v-icon>
  </v-col>


  <v-col
    :cols="cols">
    <v-btn
      v-if="allowEdit"
      @click="emit('update', -1)"
      :loading="loading"
      size="x-small"
      icon="mdi-minus"
      color="primary"
    ></v-btn>
  </v-col>

  <v-col
    @click="openSlider"
    style="text-align: center;vertical-align: middle;"
    :cols="cols">
    {{ min }}
    <template v-if="max !== null">
      / {{ max }}
    </template>
  </v-col>

  <v-col
    :cols="cols">
    <v-btn
      v-if="allowEdit"
      @click="emit('update', 1)"
      :loading="loading"
      size="x-small"
      icon="mdi-plus"
      color="primary"
    ></v-btn>
  </v-col>
</template>

<style scoped>

</style>
