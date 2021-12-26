import localStorageStore from '$lib/utils/localStorageStore'
import { writable } from 'svelte/store'

export const ranges = {
	size: { min: 75, max: 250 },
	gap: { min: 0, max: 100 },
    icon: {min: 0, max: 150},
};

const default_settings = {
	size: 75,
    gap: 25,
    icon: 50,
    transparent: true,
    showTitle: false
};

export const settings = localStorageStore('settings', default_settings)

export const showSettings = writable(false)