import localStorageStore from '$lib/utils/localStorageStore'
import { writable } from 'svelte/store'

type Range = {
	label: string
	value: number
	range: { min: number; max: number }
}

export interface Settings {
	// Todo: add theme, language, etc.
	ranges: {
		gridWidth: Range
		gridGap: Range
		iconSize: Range
	}
	transparent: boolean
	showTitle: boolean
	background: string
	lockBackground: boolean
	invertDark?: boolean
}

const default_settings: Settings = {
	ranges: {
		gridWidth: { label: 'Width', value: 1000, range: { min: 500, max: 2000 } },
		iconSize: { label: 'Icon', value: 50, range: { min: 32, max: 90 } },
		gridGap: { label: 'Spacing', value: 25, range: { min: 0, max: 100 } }
	},
	transparent: true,
	showTitle: false,
	background: 'background-image: linear-gradient(to top, rgba(24, 38, 213, 0.1), rgba(51, 105, 207, 0.1));',
	lockBackground: false
}

export const cMenu = writable({
	visible: false,
	x: 0,
	y: 0,
	el: null as HTMLElement,
	pending: false
})

export const settings = localStorageStore('settings', default_settings)

export const showSettings = writable(false)

// Used to show grid borders while updating gridWidth
export const showGuidelines = writable(false)
