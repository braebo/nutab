import localStorageStore from '$lib/utils/localStorageStore'
import { writable } from 'svelte/store'

export const activeEngine = localStorageStore('active', 0)
export const searchValue = writable('')
