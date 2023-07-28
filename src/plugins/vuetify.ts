/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import {User} from '@/Types';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export const getVuetify = (user: User|null = null) => createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          background: user?.color1 ??'#121212',
          surface: user?.color3 ??'#121212',
          primary: user?.color2 ?? '#c24815',
          secondary: '#980701',
        },
      },
    },
  },
})
