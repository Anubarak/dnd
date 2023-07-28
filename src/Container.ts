import {Router} from 'vue-router';
import {useUserStore} from '@/store/userStore';

let r: null | Router;

export const setRouter = (router: Router) => {
  r = router;
}

export const getRouter = (): Router => {
  if (!r){
    throw new Error('Router not set');
  }

  return r;
}


let userStore: ReturnType<typeof useUserStore> | null = null;
export const setUserStore = (store: ReturnType<typeof useUserStore>) => userStore = store;
export const getUserStore = () => returnStore(userStore);


const returnStore = <T extends object>(store: T | null): T => {
  if (store === null) {
    throw new Error('Store is not initialized');
  }

  return store;
}
