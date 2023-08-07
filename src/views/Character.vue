<script setup
        lang="ts">

import {computed, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useCharacterStore} from '@/store/characterStore';
import {getHeartIconForChar, showError, showMessage} from '@/services/Utils';
import {useItemStore} from '@/store/itemStore';
import {Character, Item, UsedItem} from '@/Types';
import AttributeBtns from '@/components/AttributeBtns.vue';
import {useDialog} from '@/compositions/DialogComposition';
import CharacterItem from '@/components/CharacterItem.vue';

interface Props {
  character?: Character | null;
  allowEdit?: boolean;
  editXp?: boolean;
  avatarSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  character: null,
  allowEdit: true,
  editXp: false,
  avatarSize: 80
});

const route = useRoute();
const router = useRouter();
//@ts-ignore
const charId = computed(() => Number.parseInt(route.params.id));
const characterStore = useCharacterStore();
const itemStore = useItemStore();
const char = computed(() => props.character ? props.character : characterStore.characters.find(el => el.id === charId.value));
const selectedItemId = ref<number | null>(null);
onMounted(() => {
  if (char.value === null) {
    router.push({name: 'Home'});
  }
});

const loadings = ref({
  'currentHp': false,
  'currentMp': false,
  'xp': false,
  'kills': false,
  'addItem': false,
  'deleteLoading': 0,
  'switchLoading': 0,
  'deleteChar': false,
  'hpLoading': 0,
  'armor': false,
  'movement': false,
});

const {openDialog, openImage} = useDialog();

const changeValue = async (attribute: 'armor' | 'movement' | 'xp' | 'kills' | 'currentHp' | 'currentMp', direction: number, fixedValue: boolean = false) => {
  if (loadings.value[attribute] || !char.value || !char.value.id) {
    return false;
  }

  loadings.value[attribute] = true;

  const newValue = fixedValue === false ? char.value[attribute] + direction : direction;
  try {
    let killerId: number | null = null;
    if (newValue === 0 &&
      attribute === 'currentHp' && char.value?.isEnemy) {
      const res = await openDialog<{value: number|null, title: string}>('char', {
        value: null,
        title: 'wer hat getötet?'
      });
      if(res && res.value){
        killerId = res.value
      }
    }

    await characterStore.updateValue(char.value.id, attribute, newValue);

    if (killerId !== null) {

      // delete the enemy + 1 kill for the killer...
      const killer = characterStore.characters.find(el => el.id === killerId) || null;
      if (killer) {
        await characterStore.deleteCharacter(char.value.id);
        await characterStore.updateValue(killer.id, 'kills', killer.kills + 1);
      }

    }

  } catch (err) {
    showError(err);
  } finally {
    loadings.value[attribute] = false;
  }
};

const deleteChar = async () => {
  if (!confirm('Sicher?')) {
    return false;
  }

  if (loadings.value.deleteChar || !char.value || !char.value.id) {
    return false;
  }
  loadings.value.deleteChar = true;

  try {
    await characterStore.deleteCharacter(char.value.id);
    showMessage('Gelöscht');
  } catch (err) {
    showError(err);
  } finally {
    loadings.value.deleteChar = false;
  }

};

const addItem = async () => {
  if (loadings.value.addItem || !char.value || !char.value.id) {
    return false;
  }

  if (!selectedItemId.value) {

    showError('Waffe auswählen! (╯°□°）╯︵ ┻━┻)');
    return false;
  }

  loadings.value.addItem = true;

  try {
    await characterStore.addItem(char.value.id, selectedItemId.value);
  } catch (err) {
    showError(err);
  } finally {
    loadings.value.addItem = false;
  }
};

const items = computed(() => {
  const i: UsedItem[] = [];
  char.value?.items.forEach(charItem => {
    const item = itemStore.items.find(el => el.id === charItem.itemId) || null;
    if (!item) {
      return;
    }

    i.push({
      id: charItem.id,
      title: item.title,
      icon: item.imageUrl,
      hp: item.hp,
      currentHp: charItem.uses,
      description: item.description,
      type: item.type,
      dices: item.dices,
      specialDices: item.specialDices,
      realItem: item
    });
  });

  return i.sort((a, b) => {
    if (a.title >= b.title) {
      return -1;
    }
    return 1;
  });
});

const switchItem = async (item: UsedItem) => {
  if (!char.value || !char.value.id) {
    return false;
  }

  const res = await openDialog<{value: number|null}>('char', {
    title: 'Wem willst du das Item geben?',
    value: null,
  });
  if(!res || !res.value){
    return false;
  }
  const value = res.value;

  loadings.value.switchLoading = item.id;

  try {
    await characterStore.switchItem(char.value.id, value, item.id);
    showMessage('Item getauscht');
  } catch (err) {
    showError(err);
  } finally {
    loadings.value.switchLoading = 0;
  }
}

const deleteItem = async (item: UsedItem) => {
  if (!char.value || !char.value.id) {
    return false;
  }

  if (!confirm('Sicher')) {
    return false;
  }

  loadings.value.deleteLoading = item.id;
  try {
    await characterStore.deleteItem(char.value.id, item.id);
  } catch (err) {
    showError(err);
  } finally {
    loadings.value.deleteLoading = 0;
  }
};

const changeItemHp = async (item: UsedItem, direction: number) => {
  if (!char.value || !char.value.id || item.currentHp === null) {
    return false;
  }

  let usedMana = 0;
  if(item.type === 'spell' && direction < 0){
    const barRes = await openDialog('bar', {
      title: 'Manaverbrauch festlegen',
      min: 0,
      max: (item.realItem?.manaCostSupport ?? 0) + 1,
      value: (item.realItem?.manaCostSupport ?? 1)
    })
    if(!barRes){
      showError('Manaverbrauch benötigt')
      return false;
    }

    usedMana = barRes.value;

    const restMana = char.value.currentMp - usedMana;
    if(restMana < 0){
      showError(`Du hast nicht genügend mana... ${char.value.currentMp} - ${usedMana} = ${restMana}`);
      return false;
    }
  }

  loadings.value.hpLoading = item.id;
  try {
    await characterStore.updateItem(char.value.id, item.id, item.currentHp + direction);
    if(usedMana){
      await characterStore.updateValue(char.value.id, 'currentMp', char.value.currentMp - usedMana);
    }
  } catch (err) {
    showError(err);
  } finally {
    loadings.value.hpLoading = 0;
  }
};

const heartIcon = computed(() => {
  return char.value ? getHeartIconForChar(char.value) : '';
});

const imageUrl = computed(() => {
  if (!char.value) {
    return '';
  }

  if (char.value.imageUrl) {
    return char.value.imageUrl;
  }

  const imageId = char.value?.imageId ?? null;
  if (imageId !== null) {
    const image = itemStore.itemImages.find(el => el.id === imageId) || null;
    if (image) {
      return image.url;
    }
  }

  return '/avatar.jpg';
});

const openSlider = async (type: 'currentHp' | 'currentMp') => {
  let data;
  let oldValue = 0;
  if (type === 'currentHp') {
    data = {
      min: 0,
      title: 'HP anpassen',
      max: char.value?.hp ?? 0,
      value: char.value?.currentHp ?? 0,
    };

    oldValue = char.value?.currentHp ?? 0;
  } else {
    oldValue = char.value?.currentMp ?? 0;
    data = {
      min: 0,
      title: 'MP anpassen',
      max: char.value?.mp ?? 0,
      value: char.value?.currentMp ?? 0,
    };
  }

  const res = await openDialog('bar', data);
  if (res && oldValue && res.value !== oldValue) {
    await changeValue(type, res.value, true);
  }
};

</script>

<template>
  <v-container
    class="py-8 px-6"
    fluid
  >
    <v-row>
      <v-col
        v-if="char"
        cols="12"
      >
        <v-card>
          <v-list lines="two">
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar
                  v-if="imageUrl"
                  @click="openImage(char.imageUrlLarge ?? imageUrl)"
                  :image="imageUrl"
                  :size="avatarSize"></v-avatar>
              </template>

              <v-list-item-title>{{ char.name }}</v-list-item-title>

              <v-list-item-subtitle>
                {{ char.description }}
              </v-list-item-subtitle>

              <v-container
                style="float:left;max-width: 500px"
              >
                <v-row
                  v-if="allowEdit"
                  no-gutters>
                  <AttributeBtns
                    :min="char.currentHp"
                    :max="char.hp as number"
                    :icon="heartIcon"
                    tooltip="HP"
                    @click:value="openSlider('currentHp')"
                    @update="changeValue('currentHp', $event)"
                    :loading="loadings.currentHp"
                  ></AttributeBtns>
                </v-row>
                <v-row
                  v-if="allowEdit && char.mp !== null"
                  no-gutters>
                  <AttributeBtns
                    :min="char.currentMp"
                    :max="char.mp"
                    tooltip="MP"
                    icon="mdi-lightning-bolt"
                    @click:value="openSlider('currentMp')"
                    @update="changeValue('currentMp', $event)"
                    :loading="loadings.currentMp"
                  ></AttributeBtns>
                </v-row>
                <v-row
                  v-if="allowEdit && char.isEnemy === false"
                  no-gutters>
                  <AttributeBtns
                    :min="char.xp ?? 0"
                    :allow-edit="editXp === true"
                    icon="mdi-chevron-triple-up"
                    tooltip="XP"
                    @update="changeValue('xp', $event)"
                    :loading="loadings.xp"
                  ></AttributeBtns>
                </v-row>
                <v-row
                  v-if="allowEdit && char.isEnemy === false"
                  no-gutters>
                  <AttributeBtns
                    :min="char.kills ?? 0"
                    :allow-edit="editXp === true"
                    icon="mdi-grave-stone"
                    tooltip="Kills"
                    @update="changeValue('kills', $event)"
                    :loading="loadings.kills"
                  ></AttributeBtns>
                </v-row>
                <v-row
                  v-if="allowEdit"
                  no-gutters>
                  <AttributeBtns
                    :min="char.armor ?? 0"
                    :allow-edit="true"
                    tooltip="Rüstung"
                    icon="mdi-shield-sword-outline"
                    @update="changeValue('armor', $event)"
                    :loading="loadings.armor"
                  ></AttributeBtns>
                </v-row>
                <v-row
                  v-if="allowEdit"
                  no-gutters>
                  <AttributeBtns
                    :min="char.movement?? 0"
                    :allow-edit="true"
                    tooltip="Bewegung"
                    icon="mdi-foot-print"
                    @update="changeValue('movement', $event)"
                    :loading="loadings.movement"
                  ></AttributeBtns>
                </v-row>

              </v-container>
              <v-divider/>
            </v-list-item>

            <template v-if="allowEdit">
              <v-btn
                @click="deleteChar"
                :loading="loadings.deleteChar"
                size="small"
                icon="mdi-trash-can"
                color="primary"
              >
              </v-btn>
              <v-btn
                @click="router.push({name: 'character-edit', params: {id: char.id}})"
                size="small"
                icon="mdi-pencil"
                color="primary"
              >
              </v-btn>

            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel
            title="Items">
            <v-expansion-panel-text>
              <template
                v-if="items.length > 0 && char">
                <div
                  v-for="itemType in itemStore.itemTypes"
                  :key="itemType.id"
                >
                  <template v-if="items.filter(el => el.type === itemType.id).length > 0">
                    <v-card v-if="!char.isEnemy">
                      <v-card-title>
                        {{ itemType.name }}
                      </v-card-title>
                    </v-card>
                    <CharacterItem
                      v-for="(item, i) in items.filter(el => el.type === itemType.id)"
                      :key="i"
                      :item="item"
                      :switch-loading="loadings.switchLoading === item.id"
                      :delete-loading="loadings.deleteLoading === item.id"
                      :hp-loading="loadings.hpLoading === item.id"
                      @switch-item="switchItem(item)"
                      @delete="deleteItem(item)"
                      @update-hp="changeItemHp(item, $event)"
                    ></CharacterItem>
                  </template>
                </div>
              </template>

              <v-card v-if="allowEdit && char">
                <v-card-title>
                  Item hinzufügen
                </v-card-title>

                <v-card-text>
                  <v-autocomplete
                    v-model="selectedItemId"
                    ref="autoComplete"
                    item-title="title"
                    item-value="id"
                    clearable
                    label="Item hinzufügen"
                    :items="itemStore.items"
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
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    @click="addItem"
                    :loading="loadings.addItem"
                    size="small"
                    color="primary"
                  >Item hinzufügen
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
