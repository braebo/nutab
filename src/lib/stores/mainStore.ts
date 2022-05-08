import { writable } from 'svelte/store'

type ISection = 'bookmarks' | 'news'

export const activeSection = writable('bookmarks')
