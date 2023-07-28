<script setup
        lang="ts">

import {computed, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useCharacterStore} from '@/store/characterStore';
import {showError, showMessage} from '@/services/Utils';
import {useItemStore} from '@/store/itemStore';
import {Character} from '@/Types';
import AttributeBtns from '@/components/AttributeBtns.vue';
import {useDialog} from '@/compositions/DialogComposition';

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
  'deleteChar': false,
  'hpLoading': 0,
});

const {openDialog} = useDialog();

const changeValue = async (attribute: 'xp' | 'kills' | 'currentHp' | 'currentMp', direction: number) => {
  if (loadings.value[attribute] || !char.value || !char.value.id) {
    return false;
  }

  loadings.value[attribute] = true;

  const newValue = char.value[attribute] + direction;
  try {
    let killerId: number | null = null;
    if (newValue === 0 && char.value[attribute] === 1 &&
      attribute === 'currentHp' && char.value?.isEnemy) {
      killerId = await openDialog();
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

interface UsedItem {
  id: number,
  title: string,
  icon: string | null,
  hp: number | null,
  currentHp: number | null,
  description: string
}

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
      description: item.description
    });
  });

  return i;
});

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

  loadings.value.hpLoading = item.id;
  try {
    await characterStore.updateItem(char.value.id, item.id, item.currentHp + direction);
  } catch (err) {
    showError(err);
  } finally {
    loadings.value.hpLoading = 0;
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
                  :image="char.imageUrl ?? '/avatar.jpg'"
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
                    name="HP"
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
                    name="MP"
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
                    name="XP"
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
                    name="Kills"
                    @update="changeValue('kills', $event)"
                    :loading="loadings.kills"
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

            <v-list-item
              v-if="allowEdit && !char.isEnemy">
              <v-autocomplete
                v-model="selectedItemId"
                ref="autoComplete"
                item-title="title"
                item-value="id"
                clearable
                label="Item hinzufügen"
                :items="itemStore.items"
                variant="solo"
              ></v-autocomplete>

              <v-btn
                @click="addItem"
                :loading="loadings.addItem"
                size="small"
                color="primary"
              >Item hinzufügen
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="items.length > 0">
      <v-col>

        <v-expansion-panels>
          <v-expansion-panel
            title="Items">
            <v-expansion-panel-text>
              <v-card
                v-for="(item, i) in items"
                :key="i">

                <v-card-title>
                  <v-avatar
                    size="50"
                    :image="item.icon ?? '/placeholder.jpg'"></v-avatar>
                  {{ item.title }}
                </v-card-title>

                <v-card-subtitle>
                  {{ item.description }}
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn
                    @click="deleteItem(item)"
                    :loading="loadings.deleteLoading === item.id"
                    size="small"
                    icon="mdi-trash-can"
                    color="primary"
                  ></v-btn>

                  <div v-if="item.currentHp && item.hp !== null">
                    HP
                    <v-btn
                      @click="changeItemHp(item, -1)"
                      :loading="loadings.hpLoading === item.id"
                      size="small"
                      icon="mdi-minus"
                      color="primary"
                    ></v-btn>
                    {{ item.currentHp }} / {{ item.hp }}
                    <v-btn
                      @click="changeItemHp(item, 1)"
                      :loading="loadings.hpLoading === item.id"
                      size="small"
                      icon="mdi-plus"
                      color="primary"
                    ></v-btn>
                  </div>

                </v-card-actions>
                <v-divider/>
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
