// Utilities
import {defineStore} from 'pinia';
import {Item} from '@/Types';
import {ref} from 'vue';
import apiClient from '@/api/Client';

const items = ref<Item[]>([]);
export const useItemStore = defineStore('items', () => {

  const setItems = (i: Item[]) => {
    i.forEach(el => updateStore(el));
  };

  const fetchItems = async () => {
    try {
      const res = await apiClient.get<Item[]>('/items');

      items.value = res.data;
    } catch (err) {
    }

    return items.value;
  };

  const saveItem = async (item: Item) => {
    const res = await apiClient.post<Item>('/items/save', item);

    return updateStore(res.data);
  };

  const updateStore = (item: Item) => {
    const index = items.value.findIndex(el => el.id === item.id);
    if (index === -1) {
      items.value.push(item);
    } else {
      items.value[index] = item;
    }

    return item;
  };

  return {
    items,
    fetchItems,
    saveItem,
    setItems
  };
});
