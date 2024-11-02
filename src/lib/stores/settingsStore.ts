// import localStorageStore from '$lib/utils/localStorageStore'
// import { derived, writable } from 'svelte/store'
// import { randomBackground, randomColor, randomGradient } from '$lib/utils'
// import { theme } from 'fractils'

// interface Range {
// 	label: string
// 	value: number
// 	range: { min: number; max: number }
// }

// export interface ThemeSettings {
// 	background: string
// 	lockBackground: boolean
// 	customGradient: boolean
// 	/** 6 Hex color (includes #) */
// 	gradientA: string
// 	/** 6 Hex color (includes #) */
// 	gradientB: string
// 	gradientOpacity: Range
// }

// export interface Settings {
// 	[index: string]: any
// 	ranges: {
// 		gridWidth: Range
// 		gridGap: Range
// 		iconSize: Range
// 	}
// 	transparent: boolean
// 	showTitle: boolean
// 	/** Whether or not the light and dark modes share a background */
// 	sharedTheme: boolean
// 	theme: {
// 		shared: ThemeSettings
// 		light: ThemeSettings
// 		dark: ThemeSettings
// 	}
// 	invertDark?: boolean
// }

// const sharedBG = randomBackground()
// const lightBG = randomBackground()
// const darkBG = randomBackground()

// export const default_settings: Settings = {
// 	ranges: {
// 		gridWidth: { label: 'Width', value: 1300, range: { min: 500, max: 2000 } },
// 		iconSize: { label: 'Icon', value: 50, range: { min: 32, max: 90 } },
// 		gridGap: { label: 'Spacing', value: 45, range: { min: 0, max: 100 } },
// 	},
// 	transparent: true,
// 	showTitle: false,
// 	sharedTheme: true,
// 	theme: {
// 		shared: {
// 			background: sharedBG.gradient,
// 			lockBackground: false,
// 			customGradient: false,
// 			gradientA: sharedBG.a,
// 			gradientB: sharedBG.b,
// 			gradientOpacity: { label: 'Opacity', value: sharedBG.opacity, range: { min: 0, max: 255 } },
// 		},
// 		light: {
// 			background: lightBG.gradient,
// 			lockBackground: false,
// 			customGradient: false,
// 			gradientA: lightBG.a,
// 			gradientB: lightBG.b,
// 			gradientOpacity: { label: 'Opacity', value: lightBG.opacity, range: { min: 0, max: 255 } },
// 		},
// 		dark: {
// 			background: darkBG.gradient,
// 			lockBackground: false,
// 			customGradient: false,
// 			gradientA: darkBG.a,
// 			gradientB: darkBG.b,
// 			gradientOpacity: { label: 'Opacity', value: darkBG.opacity, range: { min: 0, max: 255 } },
// 		},
// 	},
// }

// export const cMenu = writable({
// 	visible: false,
// 	x: 0,
// 	y: 0,
// 	el: null as HTMLElement,
// 	pending: false,
// })

// export const settings = localStorageStore<Settings>('settings', default_settings)

// export const showSettings = writable(false)

// export const activeTheme = derived([settings, theme], ([$settings, $theme]) => {
// 	$theme
// 	if ($settings.sharedTheme) {
// 		return $settings.theme.shared
// 	}
// 	return $settings.theme[$theme as 'light' | 'dark']
// })
