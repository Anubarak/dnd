<script setup
        lang="ts">

import {ref} from 'vue';
import {useUserStore} from '@/store/userStore';
import {useRouter} from 'vue-router';
import {showError} from '@/services/Utils';
import {useAlert} from '@/compositions/AlertComposition';
import CenterStuff from '@/components/CenterStuff.vue';

const {messages} = useAlert();
const loading = ref(false);
const userName = ref('');
const pw = ref('');
const userStore = useUserStore();
const router = useRouter();
const submit = async () => {
  loading.value = true;
  try {
    const res = await userStore.login(userName.value, pw.value);
    console.log(res);

    router.push(userStore.getRedirectRoute())
      .catch(err => {
      });
  } catch (e) {
    showError(e);
  } finally {
    loading.value = false;

  }
};

</script>

<template>
  <v-app>
    <v-main>
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

      <CenterStuff>
        <img
          src="/logo.jpg"
          style="width: 100%"
          alt="Logo">

        <v-form validate-on="submit lazy"
                @submit.prevent="submit">
          <v-text-field
            v-model="userName"
            label="Benutzername"
          ></v-text-field>

          <v-text-field
            v-model="pw"
            label="Passwort"
          ></v-text-field>

          <v-btn
            :loading="loading"
            type="submit"
            color="primary"
            block
            class="mt-2"
            text="Einloggen"
          ></v-btn>
        </v-form>
      </CenterStuff>

    </v-main>
  </v-app>
</template>

<style scoped>
</style>
