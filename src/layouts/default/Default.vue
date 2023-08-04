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
      :width="dialogWidth"
      v-model="isImageOpen"
    >
      <v-card>
        <v-card-text>
          <v-img
            class="mx-auto"
            :width="mobile? 300 : 600"
            cover
            :src="imageUrl"
          ></v-img>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="isImageOpen = false">schließen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      :width="dialogWidth"
      @update:modelValue="onChangeDialog($event, 'char')"
      v-model="dialogState.char"
    >
      <v-card v-if="dialogState.char && dialogData">
        <v-card-text>
          {{ dialogData.title }}
          <CharacterSelect
            v-model="dialogData.value"
            variant="solo"
          ></CharacterSelect>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="closeDialog('char', dialogData)">Auswählen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      :width="dialogWidth"
      @update:modelValue="onChangeDialog($event, 'bar')"
      v-model="dialogState.bar"
    >
      <v-card v-if="dialogState.bar && dialogData">
        <v-card-title>
          {{ dialogData.title }}
        </v-card-title>
        <v-card-text>
          <v-slider
            v-model="dialogData.value"
            :min="dialogData.min"
            :max="dialogData.max"
            :step="1"
            thumb-label="always"
          ></v-slider>

        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="closeDialog('bar', dialogData)">Speichern</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script lang="ts"
        setup>
import DefaultView from './View.vue';
import {computed, ref} from 'vue';
import MenuContent from '@/layouts/default/MenuContent.vue';
import {useAlert} from '@/compositions/AlertComposition';
import {useDialog} from '@/compositions/DialogComposition';
import {useCharacterStore} from '@/store/characterStore';
import {useDisplay} from 'vuetify';
import {DailogType} from '@/Types';
import CharacterSelect from '@/components/CharacterSelect.vue';

const characterStore = useCharacterStore();
const {messages} = useAlert();
const {dialogState, dialogData, closeDialog, isImageOpen, imageUrl} = useDialog();
const drawer = ref(false);

const onChangeDialog = (event: boolean, type: DailogType) => {
  if(!event) {
    closeDialog(type, null);
  }
}


const { mobile } = useDisplay();
const dialogWidth = computed(() => {
  if(mobile.value){
    return '90%';
  }
  return '50%';
})

</script>


<style scoped>
.v-alert {
  top: 50px;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  width: 150%
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
