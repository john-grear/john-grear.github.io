import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('@/pages/AboutMe.vue') },
  { path: '/', name: 'about', component: () => import('@/pages/AboutMe.vue') },
  { path: '/', name: 'education', component: () => import('@/pages/Education.vue') },
  { path: '/', name: 'experience', component: () => import('@/pages/Experience.vue') },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/NotFound.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
