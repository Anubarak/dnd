import {defineStore} from 'pinia';
import {ref} from 'vue';
import {RouteLocationNormalized, RouteLocationRaw} from 'vue-router';
import {AxiosResponse} from 'axios';
import {disconnect, joinRooms} from '@/api/socket/Manager';
import {User, UserIdentityResponse} from '@/Types';
import apiClient from '@/api/Client';
import dayjs from 'dayjs';

export const useUserStore = defineStore('user', () => {

  const user = ref<null | User>(null);
  const isLoggedIn = ref(false);

  let redirectRoute: RouteLocationNormalized | null = null;
  let lastLoginMoment: null | dayjs.Dayjs = null;
  let identityPromise: Promise<User> | null = null;

  const accessToken = ref<string | null>(localStorage.getItem('accessToken'));
  const setAccessToken = (value: string | null) => {
    if (value) {
      localStorage.setItem('accessToken', value);
    } else {
      localStorage.removeItem('accessToken');
    }
    accessToken.value = value;
  };

  const updateUser = async (model: User) => {
    const res = await apiClient.post<User>('users/save', model);

    user.value = res.data;
    return user.value;
  };

  const handleIdentityResponse = (res: AxiosResponse<UserIdentityResponse>): User => {
    user.value = res.data.identity;
    lastLoginMoment = dayjs();
    isLoggedIn.value = true;
    setAccessToken(res.data.accessToken);
    joinRooms(res.data.encoded);

    return user.value;
  };

  const handleLogout = () => {
    isLoggedIn.value = false;
    accessToken.value = null;

    setAccessToken(null);
    disconnect();
  };

  const fetchIdentity = (): Promise<User> => {
    if (identityPromise) {
      return identityPromise;
    }

    identityPromise = new Promise((resolve, reject) => {
      const momentBefore = dayjs().add(-10, 'minutes');
      if (isLoggedIn.value === true && (lastLoginMoment !== null && lastLoginMoment.isSameOrAfter(momentBefore))) {
        identityPromise = null;
        resolve(user.value as User);
        return;
      }

      apiClient.get('users/get-identity')
        .then(res => {
          resolve(handleIdentityResponse(res));
        })
        .catch(err => {
          reject(err);
        })
        .finally(() => {
          identityPromise = null;
        });
    });

    return identityPromise;
  };

  const requireLogin = async (route: RouteLocationNormalized): Promise<User> => {
    return new Promise((resolve, reject) => {
      redirectRoute = route;
      fetchIdentity()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const login = (userName: string | null, password: string | null) => {
    return new Promise((resolve, reject) => {
      apiClient.post('users/login', {userName, password})
        .then(res => {
          resolve(handleIdentityResponse(res));
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const register = (userName: string | null, password: string | null, email: string|null) => {
    return new Promise((resolve, reject) => {
      apiClient.post('users/register', {userName, password, email})
        .then(res => {
          resolve(handleIdentityResponse(res));
        })
        .catch(err => {
          reject(err);
        });
    });
  };


  const logout = () => {
    handleLogout();
  };

  const can = (permission: string) => user.value &&
    typeof user.value?.permissions!== 'undefined'&&
    (user.value?.permissions.includes(permission) || user.value.permissions?.includes('admin'));

  const getRedirectRoute = (): RouteLocationNormalized | RouteLocationRaw => redirectRoute ?? {'name': 'Home'};

  return {
    user,
    accessToken,
    isLoggedIn,

    can,
    setAccessToken,
    requireLogin,
    fetchIdentity,
    login,
    logout,
    getRedirectRoute,
    updateUser,
    register
  };
});
