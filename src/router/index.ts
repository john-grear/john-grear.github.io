import { createRouter, createWebHistory } from 'vue-router';

import MainPage from '../pages/MainPage.vue';

const routes = [
  { path: '/', component: MainPage },
  // { path: '/about', component: () => import('@/pages/About.vue') },
  // { path: '/education', component: () => import('@/pages/Education.vue') },
  // { path: '/experience', component: () => import('@/pages/Experience.vue') },
  // { path: '/resume', component: () => import('@/pages/Resume.vue') },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
