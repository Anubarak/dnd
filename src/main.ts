/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue';
// Composables
import {createApp} from 'vue';
// Plugins
import {registerPlugins} from '@/plugins';
import {useUserStore} from '@/store/userStore';
import {setRouter, setUserStore} from '@/Container';
import {getVuetify} from '@/plugins/vuetify';
import router from '@/router';
import 'dayjs/locale/de';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.locale('de');
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const init = async () => {

  const app = createApp(App);


  registerPlugins(app);

  setRouter(router);
  const userStore = useUserStore();

  setUserStore(userStore);
  if (userStore.accessToken) {
    await userStore.fetchIdentity();
  }


  app.use(router);
  app.use(getVuetify(userStore.user));
  app.mount('#app');
};

init();
