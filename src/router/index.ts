// Composables
import {createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized} from 'vue-router';
import {useCharacterStore} from '@/store/characterStore';
import {getUserStore} from '@/Container';
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    meta: {
      requireLogin: true,
    },
    children: [
      {
        path: '',
        name: 'Home',
        meta: {
          requireLogin: true,
        },
        redirect: () => {
          const charStore = useCharacterStore();

          const first = charStore.characters[0] ?? null;

          if(!first){
            return {name: 'character-form'};
          }

          return {name: 'character', params: {id: first.id}};
        },
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'character/:id',
        name: 'character',
        meta: {
          requireLogin: true,
        },
        component: () => import('@/views/Character.vue'),
      },
      {
        path: 'character-edit/:id',
        name: 'character-edit',
        meta: {
          requireLogin: true,
        },
        component: () => import('@/views/CharacterEdit.vue'),
      },
      {
        path: 'new-item',
        name: 'item-form',
        meta: {
          requireLogin: true,
        },
        component: () => import('@/views/ItemForm.vue'),
      },
      {
        path: 'new-character',
        name: 'character-form',
        meta: {
          requireLogin: true,
        },
        component: () => import('@/views/NewCharacter.vue'),
      },
      {
        path: 'new-enemy',
        name: 'enemy-form',
        component: () => import('@/views/NewEnemy.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        meta: {
          requireLogin: true,
        },
        component: () => import('@/views/Settings.vue'),
      },
      {
        path: 'characters',
        name: 'characters',
        meta: {
          requireLogin: true,
        },
        component: () => import('@/views/CharacterList.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/layouts/Login.vue'),
    meta: {
      requireLogin: false,
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error-404',
    component: () => import('@/views/Error404.vue'),
    meta: {
      requireLogin: false,
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const beforeEach = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const requireLogin = to.meta?.requireLogin ?? false;

  const userStore = getUserStore();
  if (to.name === 'login'){
    if(userStore.isLoggedIn){
      next({name: 'Home'});
    }else {
      next();
    }
    return;
  } else if(requireLogin){

    try {
      await userStore.requireLogin(to);
      next();
    } catch (err) {
      console.log('möp error', err);
      // no currentUser -> redirect to login
      next('/login');
    }

    return;
  }
  next();
};

router.beforeEach(beforeEach);

export default router
