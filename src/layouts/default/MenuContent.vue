<template>
  <v-list-item>
    <v-list-item-title class="text-h6">
      <RouterLink :to="{name: 'Home'}">Goteishi DnD</RouterLink>
    </v-list-item-title>
    <v-list-item-subtitle>
      Characters
    </v-list-item-subtitle>
  </v-list-item>

  <v-divider></v-divider>
  <v-list density="compact">
    <v-list-subheader>Chracters</v-list-subheader>
    <MenuItemComponent
      v-for="(item, i) in menuItems"
      :key="i"
      :item="item"
    ></MenuItemComponent>

    <v-list-subheader>Formulare</v-list-subheader>
    <MenuItemComponent
      v-for="(item, i) in adminItems.filter(el => el.requiresAdmin === false || userStore.user.hasAdminPermissions)"
      :key="i"
      :item="item"
    ></MenuItemComponent>

    <v-list-subheader>Account</v-list-subheader>
    <v-list-item
      color="primary"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-cog"></v-icon>
      </template>
      <v-list-item-title>
        <RouterLink :to="{name: 'settings'}">
          Settings
        </RouterLink>
      </v-list-item-title>
    </v-list-item>

    <v-list-item
      color="primary"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-logout"></v-icon>
      </template>
      <v-list-item-title>
        <span @click="logout">
          Logout
        </span>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts"
        setup>


import {computed} from 'vue';
import {useCharacterStore} from '@/store/characterStore';
import {showError} from '@/services/Utils';
import {useUserStore} from '@/store/userStore';
import {useRouter} from 'vue-router';
import MenuItemComponent from '@/components/MenuItem.vue';
import {MenuItem} from '@/Types';

const characterStore = useCharacterStore();
const menuItems = computed(() => {
  const items: MenuItem[] = [];
  characterStore.characters.forEach((character) => {
    if(character.isEnemy){
      return false;
    }
    items.push({
      title: character.name,
      id: character.id,
      avatar: character.imageUrl,
      icon: 'mdi-account',
      divider: false,
      requiresAdmin: false,
      type: 'char',
      route: {
        name: 'character',
        params: {
          id: character.id
        }
      }
    });
  });

  if(items.length){
    items[items.length-1].divider = true;
  }

  return items;
});

const adminItems = computed(() => {
  const items: MenuItem[] = [];

  items.push({
    title: 'Char Erstellen',
    id: null,
    avatar: null,
    requiresAdmin: false,
    icon: 'mdi-trophy',
    divider: false,
    type: 'none',
    route: {
      name: 'character-form'
    }
  });

  items.push({
    title: 'Item Erstellen',
    id: null,
    requiresAdmin: true,
    avatar: null,
    icon: 'mdi-bow-arrow',
    divider: false,
    type: 'none',
    route: {
      name: 'item-form'
    }
  });


  items.push({
    title: 'Gegner Vorlagen',
    id: null,
    avatar: null,
    requiresAdmin: true,
    icon: 'mdi-google-downasaur',
    divider: false,
    type: 'none',
    route: {
      name: 'enemy-form'
    }
  });
  items.push({
    title: 'Alle Charactere',
    id: null,
    divider: true,
    requiresAdmin: true,
    avatar: null,
    icon: 'mdi-account-convert',
    type: 'none',
    route: {
      name: 'characters'
    }
  });

  return items;
})

const userStore = useUserStore();
const router = useRouter();
const logout = async () => {
  try {
    userStore.logout();
    router.push({name: 'login'});
  } catch (err) {
    showError('Fehler beim Logout');
  }
};
</script>

<style scoped>
.v-list-item__prepend > .v-avatar {
  margin-inline-end: 32px;
}
</style>
