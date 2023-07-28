<template>
  <v-app>
    <div class="text-center notificationContainer">
      <v-slide-y-transition group>
        <v-alert
          v-for="message in messages"
          :key="message.id"
          :title="message.type === 'error'? 'Fehler' : 'Info'"
          :text="message.message"
          :type="message.type"
        ></v-alert>
      </v-slide-y-transition>
    </div>

    <v-navigation-drawer v-model="drawer">
      <MenuContent/>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>DnD</v-toolbar-title>
    </v-app-bar>

    <default-view/>

    <v-dialog
      @update:modelValue="onChangeDialog"
      v-model="isOpen"
    >
      <v-card>
        <v-card-text>
          wer hat getötet?
          <v-select
            v-model="killerId"
            ref="autoComplete"
            item-title="name"
            item-value="id"
            clearable
            label="Chracter auswählen"
            :items="characterStore.heros"
            variant="solo"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="closeDialog(killerId)">Auswählen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts"
        setup>
import DefaultView from './View.vue';
import {ref} from 'vue';
import MenuContent from '@/layouts/default/MenuContent.vue';
import {useAlert} from '@/compositions/AlertComposition';
import {useDialog} from '@/compositions/DialogComposition';
import {useCharacterStore} from '@/store/characterStore';

const characterStore = useCharacterStore();
const {messages} = useAlert();
const killerId = ref(null);
const {isOpen, closeDialog} = useDialog();
const drawer = ref(false);

const onChangeDialog = (event: boolean) => {
  if(!event) {
    closeDialog(null);
    killerId.value = null;
  }
}
</script>


<style scoped>
.v-alert {
  top: 50px;
  transform: translate(-50%, -50%);
  margin: 0 auto;
}
.notificationContainer {
  left: 50%;
  z-index: 5000;
  position: fixed;
  top: 10px;
  display: grid;
  grid-gap: .5em;
}

</style>
