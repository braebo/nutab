// import { localStorageStore } from '$lib/utils/localStorageStore'

// export const inspectorStore = localStorageStore<Record<string, boolean>>('inspector', {})

export const inspectorStore = $state<{ value: Record<string, boolean> }>({ value: {} })
