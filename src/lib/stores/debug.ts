import { localStorageStore } from 'fractils'
import { writable } from 'svelte/store'

export const debug = writable(true)

export const showDebugger = localStorageStore('showDebugger', false)
