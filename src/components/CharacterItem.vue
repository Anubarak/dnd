<script setup
        lang="ts">
import DiceChip from '@/components/DiceChip.vue';
import {UsedItem} from '@/Types';
interface Props {
  item: UsedItem
  hpLoading: boolean
  deleteLoading: boolean
  switchLoading: boolean
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update-hp', direction: number): void
  (e: 'delete'): void
  (e: 'switch-item'): void
}>();

</script>

<template>
  <v-card>
    <v-card-title>
      <v-avatar
        size="50"
        :image="item.icon ?? '/placeholder.jpg'"></v-avatar>
      {{ item.title }}
    </v-card-title>

    <v-card-subtitle>
      <v-container>
        <v-row class="padding-5px">
          {{ item.description }}
        </v-row>
        <v-row class="padding-5px padding-bottom-icon">
          <DiceChip
            v-for="(dice, index) in item.dices"
            :key="index"
            :clearable="false"
            :dice="dice">
          </DiceChip>
        </v-row>

        <div v-if="item.specialDices.length > 0">
          <v-row class="padding-5px">
            Heftiger Anrgiff
          </v-row>
          <v-row class="padding-5px">
            <DiceChip
              v-for="(dice, index) in item.specialDices"
              :key="index"
              :clearable="false"
              :dice="dice">
            </DiceChip>
          </v-row>
        </div>

        <template v-if="item.type === 'spell'">
          <v-row class="padding-5px">
            Manakosten Zauberer: {{item.realItem?.manaCostWizzard}}
          </v-row>
          <v-row class="padding-5px">
            Manakosten Support: {{item.realItem?.manaCostSupport}}
          </v-row>
        </template>
      </v-container>
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        @click="emit('delete')"
        :loading="deleteLoading"
        size="small"
        icon="mdi-trash-can"
        color="primary"
      ></v-btn>

      <div v-if="item.currentHp && item.hp !== null">
        <v-btn
          @click="emit('update-hp', -1)"
          :loading="hpLoading"
          size="small"
          icon="mdi-minus"
          color="primary"
        ></v-btn>
        {{ item.currentHp }} / {{ item.hp }}
        <v-btn
          @click="emit('update-hp', 1)"
          :loading="hpLoading"
          size="small"
          icon="mdi-plus"
          color="primary"
        ></v-btn>
      </div>

      <v-tooltip text="Item einen anderen Character geben">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            @click="emit('switch-item')"
            :loading="switchLoading"
            size="small"
            icon="mdi-account-switch-outline"
            color="primary"
          ></v-btn>
        </template>
      </v-tooltip>
    </v-card-actions>
    <v-divider/>
  </v-card>
</template>

<style scoped>

</style>
