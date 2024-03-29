/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import MainContent from '@/pages/MainContent.vue'

const router = createRouter({
  history: createWebHistory('/Snug-smart-app/'),
  extendRoutes: setupLayouts,
  routes: [
    {
      path: '/MainContent',
      component: MainContent
    }
  ]
})

export default router
