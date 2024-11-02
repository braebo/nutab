// import { writable } from 'svelte/store'

// export const activeSection = writable<'bookmarks' | 'news'>('bookmarks')

export const activeSection = $state<{ value: 'bookmarks' | 'news' }>({ value: 'bookmarks' })
