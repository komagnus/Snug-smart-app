import { createPinia } from 'pinia'
import router from '../router'
import vuetify from './vuetify'
import type { App } from 'vue'
import { createPersistedStateWithSessionStorage } from '@/store/sessionStore'

export function registerPlugins (app: App) {
  const pinia = createPinia()
  pinia.use(createPersistedStateWithSessionStorage())
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
