<script setup
        lang="ts">
import {computed} from 'vue';
import CharacterForm from '@/components/CharacterForm.vue';
import {useRoute} from 'vue-router';
const route = useRoute();
//@ts-ignore
const charId = computed(() => Number.parseInt(route.params.id));
</script>

<template>
  <CharacterForm
    :id="charId"
    :redirect="true"
    :is-enemy="false" />
</template>

<style scoped>

</style>
