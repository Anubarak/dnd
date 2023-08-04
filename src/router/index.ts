// Composables
import {createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized} from 'vue-router';
import {getUserStore} from '@/Container';
import {showError} from '@/services/Utils';
const routes = [
  {
    path: '/',
    name: 'default',
    component: () => import('@/layouts/default/Default.vue'),
    meta: {
      requireLogin: true,
      requireAdmin: false,
    },
    children: [
      {
        path: '',
        name: 'Home',
        meta: {
          requireLogin: true,
          requireAdmin: false,
        },
        children: [],
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'character/:id',
        name: 'character',
        meta: {
          requireLogin: true,
          requireAdmin: false,
        },
        component: () => import('@/views/Character.vue'),
      },
      {
        path: 'character-edit/:id',
        name: 'character-edit',
        meta: {
          requireLogin: true,
          requireAdmin: false,
        },
        component: () => import('@/views/CharacterEdit.vue'),
      },
      {
        path: 'item-form/:id?',
        name: 'item-form',
        meta: {
          requireLogin: true,
          requireAdmin: true,
        },
        component: () => import('@/views/ItemForm.vue'),
      },
      {
        path: 'new-character',
        name: 'character-form',
        meta: {
          requireLogin: true,
          requireAdmin: false,
        },
        component: () => import('@/views/NewCharacter.vue'),
      },
      {
        path: 'new-enemy',
        name: 'enemy-form',
        meta: {
          requireLogin: true,
          requireAdmin: true,
        },
        component: () => import('@/views/NewEnemy.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        meta: {
          requireLogin: true,
          requireAdmin: false,
        },
        component: () => import('@/views/Settings.vue'),
      },
      {
        path: 'characters',
        name: 'characters',
        meta: {
          requireLogin: true,
          requireAdmin: true,
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
      requireAdmin: false,
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error-404',
    component: () => import('@/views/Error404.vue'),
    meta: {
      requireLogin: false,
      requireAdmin: false,
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const beforeEach = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const requireLogin = to.meta?.requireLogin ?? false;
  const requireAdmin = to.meta?.requireAdmin?? false;

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


      if(!requireAdmin || userStore.user.hasAdminPermissions){
        next();
      } else{
        showError('Nono... du musst admin sein');
        next({name: 'Home'});
      }
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
