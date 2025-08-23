import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { createApp } from 'vue';

import { DialogService, ToastService } from 'primevue';
import PrimeVue from 'primevue/config';

import 'primeicons/primeicons.css';

import '@/assets/styles/main.css';

import App from './App.vue';
import { router } from './router';

const app = createApp(App);

const themePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: 'var(--new-primary-50)',
      100: 'var(--new-primary-100)',
      200: 'var(--new-primary-200)',
      300: 'var(--new-primary-300)',
      400: 'var(--new-primary-400)',
      500: 'var(--new-primary-500)',
      600: 'var(--new-primary-600)',
      700: 'var(--new-primary-700)',
      800: 'var(--new-primary-800)',
      900: 'var(--new-primary-900)',
      950: 'var(--new-primary-950)',
    },
  },
});

app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: themePreset,
    options: {
      darkModeSelector: '.dark-mode',
      cssLayer: false,
    },
  },
});

app.use(DialogService);
app.use(ToastService);
app.use(router);
app.mount('#app');
