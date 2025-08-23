import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('@/pages/Portfolio.vue') },
  { path: '/about', component: () => import('@/pages/AboutMe.vue') },
  { path: '/education', component: () => import('@/pages/Education.vue') },
  { path: '/experience', component: () => import('@/pages/Experience.vue') },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/NotFound.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
