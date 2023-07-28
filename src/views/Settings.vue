<script setup
        lang="ts">

import {ref} from 'vue';
import {useUserStore} from '@/store/userStore';
import {showError, showMessage} from '@/services/Utils';
import {User} from '@/Types';
import {useRouter} from 'vue-router';

const loading = ref(false);

const router = useRouter();
const userStore = useUserStore();
if(!userStore.user){
  router.push({name: 'login'});
}

const user = ref<User>({...userStore.user});

const reset = () => {
  user.value.color1 = '#121212';
  user.value.color2 = '#c24815';
  user.value.color3 = '#121212';
}

const onSubmit = async () => {
  loading.value = true;
  try {
      await userStore.updateUser(user.value);
      showMessage('erfolgreich gespeichert');
      window.location.href = '/';
  } catch (err) {
    showError(err);
  } finally {
      loading.value = false;
  }
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-container>
      <v-row>
        Background Color<br>
        <v-color-picker v-model="user.color1"></v-color-picker>
      </v-row>

      <v-row>
        Primary Color<br>
        <v-color-picker v-model="user.color2"></v-color-picker>
      </v-row>
      <v-row>
        Surface Color<br>
        <v-color-picker v-model="user.color3"></v-color-picker>
      </v-row>

      <v-btn
        :loading="loading"
        type="submit"
        color="primary"
        class="mt-2"
        text="Absenden"
      ></v-btn>
      <v-btn
        @click="reset"
        :loading="loading"
        color="primary"
        class="mt-2"
        text="reset"
      ></v-btn>
    </v-container>
  </v-form>
</template>

<style scoped>

</style>
