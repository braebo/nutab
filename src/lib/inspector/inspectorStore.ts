import { localStorageStore } from '$lib/utils/localStorageStore'

export const inspectorStore = localStorageStore<Record<string, boolean>>('inspector', {})
