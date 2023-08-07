<script setup
        lang="ts">

import {Item} from '@/Types';
import {useItemStore} from '@/store/itemStore';

interface Props {
    modelValue: number[],
    mulitple?: boolean
    chips?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    mulitple: false,
    chips: false,
    modelValue: []
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: number[]|number): void
}>();

const itemStore = useItemStore();

const change = (selectedIds: number[]) => {
    emit('update:modelValue', selectedIds);
}
</script>

<template>
    <v-autocomplete
        :model-value="modelValue"
        @update:model-value="change"
        ref="autoComplete"
        item-title="title"
        item-value="id"
        :multiple="mulitple"
        clearable
        label="Item hinzufügen"
        :items="itemStore.items"
        :chips="chips"
        variant="solo"
    >
        <template v-slot:item="{ props, item }: {props: any, item: {raw: Item}}">
            <v-list-item
                v-bind="props"
                :prepend-avatar="item?.raw?.imageUrl"
                :subtitle="item?.raw?.description"
                :title="item?.raw?.title"
            ></v-list-item>
        </template>
    </v-autocomplete>
</template>

<style scoped>

</style>
