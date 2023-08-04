/// <reference types="vite/client" />

declare module '*.vue' {
  //@ts-ignore
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requireLogin: boolean;
    requireAdmin: boolean;
  }
}
