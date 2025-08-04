import Aura from '@primeuix/themes/aura';

import { createApp } from 'vue';

import PrimeVue from 'primevue/config';

import 'primeicons/primeicons.css';

import App from './App.vue';
import { router } from './router';
import './style.css';

const app = createApp(App);

app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
});

app.use(router);
app.mount('#app');
