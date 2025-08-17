import Aura from '@primeuix/themes/aura';

import { createApp } from 'vue';

import { DialogService, ToastService } from 'primevue';
import PrimeVue from 'primevue/config';

import 'primeicons/primeicons.css';

import App from './App.vue';
import './main.css';
import { router } from './router';

const app = createApp(App);

app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
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
