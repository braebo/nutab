import { writable } from 'svelte/store'

export const activeSection = writable<'bookmarks' | 'news'>('bookmarks')
