
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../pages/HomePage.vue') },
  { path: '/project', component: () => import('../pages/ProjectPage.vue') },
  { path: '/cases', component: () => import('../pages/CasesPage.vue') },
  { path: '/cases/:caseId', component: () => import('../pages/CaseDetailPage.vue') },
  { path: '/simulation', component: () => import('../pages/SimulationPage.vue') },
  { path: '/about', component: () => import('../pages/AboutPage.vue') },
  { path: '/404', component: () => import('../pages/NotFoundPage.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/404' }
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
