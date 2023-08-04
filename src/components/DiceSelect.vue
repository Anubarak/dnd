<script setup
        lang="ts">

import {Dice} from '@/Types';
import DiceChip from '@/components/DiceChip.vue';
import {useItemStore} from '@/store/itemStore';
import {computed} from 'vue';

interface Props {
  modelValue: Dice[]|number[];
  title: string
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', data: Dice[]): void
  (e: 'input', data: Dice[]): void
}>();

const itemStore = useItemStore()
const possibleDices: Dice[] = itemStore.dices;

const getCurrentIds = () => {
  const existing: number[] = [];
  props.modelValue.forEach((dice: Dice|number) => {
    if(typeof dice === 'object') {
      const d = itemStore.dices.find(el => el.title === dice.title) || null;
      if(d){
        existing.push(d.id);
      }
    } else {
      existing.push(dice);
    }
  })

  return existing;
}

const removeDice = (index: number) => {
  const existing = getCurrentIds();
  existing.splice(index, 1);
  emit('update:modelValue', existing);
  emit('input', existing);
};

const addDice = (dice: Dice) => {
  const existing = getCurrentIds();
  existing.push(dice.id);
  emit('update:modelValue', existing);
  emit('input', existing);
};

const dices = computed<Dice[]>(() => {
  const d = [];
  props.modelValue.forEach((dice: Dice|number) => {
    if(typeof dice === 'object') {
      d.push(dice);
    } else {
      const diceObject = itemStore.getDiceById(dice);
      if(diceObject){
        d.push(diceObject);
      }
    }
  })

  return d;
});

</script>

<template>
  <v-container>
    <label>{{ title }}</label><br>
    <DiceChip
      v-for="(dice, index) in dices"
      :key="index"
      @click:close="removeDice(index)"
      :clearable="true"
      :dice="dice">
    </DiceChip>

    <v-container>
      <v-row no-gutters>
        <v-col
          v-for="(dice, index) in possibleDices"
          :key="index"
          cols="4"
          sm="1"
        >
          <v-sheet class="ma-2 pa-2">
            <v-btn
              @click="addDice(dice)"
              color="background">
              <v-icon
                start
                :color="dice.color"
                :icon="dice.icon"></v-icon>

            </v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>

</style>
