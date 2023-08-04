<script setup
        lang="ts">
import {Dice} from '@/Types';
import {useItemStore} from '@/store/itemStore';
import {computed} from 'vue';

interface Props {
  clearable?: boolean;
  dice: Dice | number;
}

const props = withDefaults(defineProps<Props>(), {
  clearable: false
});

const emit = defineEmits<{
  (e: 'click:close', event: PointerEvent): void
}>();

const itemStore = useItemStore();
const diceObject = computed<Dice>(() => {
  if (typeof props.dice === 'number') {
    const d = itemStore.getDiceById(props.dice);
    if (!d) {
      throw new Error('Dice with id ' + props.dice + ' not found');
    }

    return d;
  }

  return props.dice;
});

</script>

<template>
  <v-chip
    :style="!clearable? {'padding-right': '0px'} : null"
    :text-color="diceObject.color">
    <v-icon
      start
      :color="diceObject.color"
      :icon="diceObject.icon"/>

    <v-icon
      v-if="clearable"
      end
      ripple
      @click="emit('click:close', $event)"
      :color="diceObject.color"
      icon="mdi-close"/>
  </v-chip>
</template>


<style scoped>

</style>
