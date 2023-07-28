<script setup
        lang="ts">
interface Props {
  name: string,
  min: number
  max?: number | null
  loading: boolean,
  allowEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: null,
  allowEdit: true
});

const cols = 3;

const emit = defineEmits<{
  (e: 'update', value: number): void
}>();
</script>

<template>
  <v-col
    :cols="cols">
    {{ name }}
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
