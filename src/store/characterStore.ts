import {defineStore} from 'pinia';
import {Character} from '@/Types';
import {computed, ref} from 'vue';
import apiClient from '@/api/Client';

const characters = ref<Character[]>([]);
export const useCharacterStore = defineStore('characters', () => {


  const setCharacters = (chars: Character[]) => {
    chars.forEach(el => updateStore(el));
  }

  const fetchCharacters = async () => {
    const res = await apiClient.get<Character[]>('/characters');
    characters.value = res.data;

    return characters.value;
  };

  const saveCharacter = async (character: Character) => {
    const res = await apiClient.post<Character>('/characters/save', character);

    return updateStore(res.data);
  };

  const deleteCharacter = async (id: number) => {
    await apiClient.post('/characters/delete', {
      id: id
    });

    const index = characters.value.findIndex(character => character.id === id);
    if (index !== -1) {
      characters.value.splice(index, 1);
    }
  };

  const updateValue = async (id: number, attribute: keyof Character, value: Character[keyof Character]) => {
    const res = await apiClient.post<Character>('/characters/update-value', {
      id: id,
      attribute: attribute,
      value: value
    });

    const index = characters.value.findIndex(character => character.id === id);
    if (index !== -1) {
      characters.value[index] = res.data;
    }
  };

  const addItem = async (id: number, itemId: number) => {
    const res = await apiClient.post<Character>('/characters/add-item', {
      id: id,
      itemId: itemId
    });

    return updateStore(res.data);
  };

  const deleteItem = async (id: number, itemId: number) => {
    const res = await apiClient.post<Character>('/characters/delete-item', {
      id: id,
      itemId: itemId
    });

    return updateStore(res.data);
  };

  const switchItem = async (sourceId: number, targetId: number, itemId: number) => {
    await apiClient.post<Character>('/characters/switch-item', {
      sourceId,
      targetId,
      itemId,
    });

    return true;
  };

  const updateItem = async (id: number, itemId: number, hp: number) => {
    const res = await apiClient.post<Character>('/characters/update-item', {
      id: id,
      itemId: itemId,
      hp: hp
    });

    return updateStore(res.data);
  };

  const updateStore = (res: Character) => {
    const index = characters.value.findIndex(character => character.id === res.id);
    if (index !== -1) {
      characters.value[index] = res;
    } else {
      characters.value.push(res);
    }

    return res;
  };

  const createEnemyFromTemplate = async (id: number, title: string|null = null) => {
    const res = await apiClient.post<Character>('/characters/create-enemy-from-template', {
      id: id,
      title: title
    })

    return updateStore(res.data);
  }

  const heros = computed(() => characters.value.filter(character => !character.isEnemy));
  const enemies = computed(() => characters.value.filter(character => character.isEnemy && !character.isTemplate));
  const enemyTemplates = computed(() => characters.value.filter(character => character.isEnemy && character.isTemplate))

  return {
    characters,
    enemyTemplates,
    heros,
    enemies,
    fetchCharacters,
    deleteCharacter,
    updateValue,
    saveCharacter,
    addItem,
    deleteItem,
    updateItem,
    setCharacters,
    createEnemyFromTemplate,
    switchItem
  };
});
