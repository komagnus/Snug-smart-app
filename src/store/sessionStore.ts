import { PiniaPluginContext } from 'pinia'

export function createPersistedStateWithSessionStorage(): (context: PiniaPluginContext) => void {
  return ({ store }) => {
    // Load persisted state from sessionStorage on store initialization
    const persistedState = sessionStorage.getItem(store.$id)
    if (persistedState) {
      store.$patch(JSON.parse(persistedState))
    }

    // Watch for changes in the store's state and persist them to sessionStorage
    store.$subscribe((mutation, state) => {
      sessionStorage.setItem(store.$id, JSON.stringify(state))
    })
  }
}
