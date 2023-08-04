// Utilities
import {defineStore} from 'pinia';
import {Dice, Item, ItemImage, ItemType} from '@/Types';
import {ref} from 'vue';
import apiClient from '@/api/Client';

const items = ref<Item[]>([]);

const itemTypes = ref<ItemType[]>([]);
const itemImages = ref<ItemImage[]>([]);

const dices: Dice[] = [
  {
    color: 'yellow',
    title: 'Gelb',
    icon: 'mdi-dice-1-outline',
    id: 1,
  },
  {
    color: 'orange',
    title: 'Orange',
    icon: 'mdi-dice-2-outline',
    id: 2,
  },
  {
    color: 'red',
    title: 'Rot',
    icon: 'mdi-dice-3-outline',
    id: 3,
  },
  {
    color: 'purple',
    title: 'Lila',
    icon: 'mdi-dice-3-outline',
    id: 4,
  },
  {
    color: 'white',
    title: 'Bombe',
    icon: 'mdi-bomb',
    id: 5,
  },
  {
    color: 'white',
    title: 'Falle',
    icon: 'mdi-eye',
    id: 6,
  },
  {
    color: 'white',
    title: 'Stern',
    icon: 'mdi-star',
    id: 7,
  },
  {
    color: 'white',
    title: 'Untot',
    icon: 'mdi-skull-outline',
    id: 8,
  },
  {
    color: 'white',
    title: 'Reroll',
    icon: 'mdi-cached',
    id: 9,
  },
];
export const useItemStore = defineStore('items', () => {

  const setItems = (i: Item[]) => {
    i.forEach(el => updateStore(el));
  };

  const fetchItems = async () => {
    const res = await apiClient.get<Item[]>('/items');

    items.value = res.data;

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

  const deleteItem = async (id: number) => {
    await apiClient.post<boolean>('/items/delete', {
      id
    });
    const index = items.value.findIndex(el => el.id === id);

    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  const fetchItemTypes = async () => {
    const res = await apiClient.get<ItemType[]>('/items/item-types');

    itemTypes.value = res.data;

    return itemTypes.value;
  };

  const fetchItemImages = async () => {
    const res = await apiClient.get<ItemImage[]>('/items/images');

    itemImages.value = res.data;

    return itemImages.value;
  };

  const getDiceById = (id: number): Dice | null => {
    return dices.find(el => el.id === id) || null;
  };

  return {
    items,
    fetchItems,
    saveItem,
    setItems,
    deleteItem,
    itemTypes,
    fetchItemTypes,
    itemImages,
    fetchItemImages,
    dices,
    getDiceById
  };
});
