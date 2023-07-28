import axios from 'axios';
import {getUserStore} from '@/Container';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  //withCredentials: true,
  // timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});



apiClient.interceptors.request.use(
  config => {
    const userStore = getUserStore();
    const accessToken = userStore.accessToken;
    if (config.url !== 'users/login' && accessToken) {
      config.headers['x-dnd-token'] = accessToken;
    }

    return config;
  },
  error => Promise.reject(error)
);

export default apiClient;
