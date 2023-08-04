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
if (!userStore.user) {
  router.push({name: 'login'});
}

const user = ref<User>({...userStore.user as User});

const reset = () => {
  user.value.color1 = '#121212';
  user.value.color2 = '#c24815';
  user.value.color3 = '#121212';
};

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
};
const colors: { headline: string, attribute: keyof Pick<User, 'color1' | 'color2' | 'color3'> }[] = [
  {headline: 'Background Color', attribute: 'color1'},
  {headline: 'Primary Color', attribute: 'color2'},
  {headline: 'Surface Color', attribute: 'color3'},
];

</script>

<template>
  <v-container>
    <v-form @submit.prevent="onSubmit">

      <div v-for="color in colors"
           :key="color.attribute">
        <v-row style="padding-top: 20px">
          {{ color.headline }}
        </v-row>
        <v-row>
          <v-color-picker v-model="user[color.attribute]"></v-color-picker>
        </v-row>
      </div>

      <v-row style="padding-top: 20px; padding-bottom: 20px">
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
      </v-row>
    </v-form>
  </v-container>
</template>

<style scoped>
.v-row {
  padding-left: 20px;
}
</style>
