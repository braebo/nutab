// import type { Settings, RawSettings } from '$lib/data/types'

// import { createActiveGradient } from '$lib/theme_og/createGradient'
// // import { LocalStorage } from '$lib/utils/localState.svelte'
// import { persist } from '$lib/utils/persist.svelte'
// import { themer } from '$lib/theme/themer.svelte'
// import { randomBackground } from '$lib/utils'

// const sharedBG = randomBackground()
// const lightBG = randomBackground()
// const darkBG = randomBackground()

// const shared = {
// 	background: sharedBG.gradient,
// 	lockBackground: false,
// 	customGradient: false,
// 	gradientA: sharedBG.a,
// 	gradientB: sharedBG.b,
// 	gradientOpacity: sharedBG.opacity,
// }

// type Theme = typeof shared

// const light: Theme = {
// 	...shared,
// 	background: lightBG.gradient,
// 	gradientA: lightBG.a,
// 	gradientB: lightBG.b,
// 	gradientOpacity: lightBG.opacity,
// }

// const dark: Theme = {
// 	...shared,
// 	background: darkBG.gradient,
// 	gradientA: darkBG.a,
// 	gradientB: darkBG.b,
// 	gradientOpacity: darkBG.opacity,
// }

// export const cMenu = $state({
// 	visible: false,
// 	x: 0,
// 	y: 0,
// 	el: null as unknown as HTMLElement,
// 	pending: false,
// })

// const k = 'nutab_settings_'

// class SettingsManager implements Settings {
// 	ranges = {
// 		gridWidth: persist(k + 'gridWidth', 1300),
// 		gridGap: persist(k + 'gridGap', 50),
// 		iconSize: persist(k + 'iconSize', 45),
// 	}
// 	transparent = persist(k + 'transparent', true)
// 	showTitle = persist<boolean>(k + 'showTitle', false)
// 	sharedTheme = persist<boolean>(k + 'sharedTheme', false)
// 	theme = {
// 		shared: persist(k + 'theme_shared', shared),
// 		light: persist(k + 'theme_light', light),
// 		dark: persist(k + 'theme_dark', dark),
// 	}
// 	invertDark = persist(k + 'invertDark', false)

// 	activeTheme = $derived.by(() => {
// 		if (this.sharedTheme) {
// 			return this.theme.shared
// 		}
// 		return this.theme[themer.mode]
// 	})

// 	showSettings = $state(false)

// 	activeBackground = $derived.by(() => createActiveGradient(this.activeTheme))

// 	constructor() {
// 		this.dispose = $effect.root(() => {
// 			$effect(() => {
// 				this
// 				console.log({ this: this })
// 			})
// 		})
// 	}

// 	toJSON = (): RawSettings => {
// 		return {
// 			ranges: {
// 				gridWidth: this.ranges.gridWidth.value,
// 				gridGap: this.ranges.gridGap.value,
// 				iconSize: this.ranges.iconSize.value,
// 			},
// 			transparent: this.transparent.value,
// 			showTitle: this.showTitle.value,
// 			sharedTheme: this.sharedTheme.value,
// 			theme: {
// 				shared: this.theme.shared,
// 				light: this.theme.light,
// 				dark: this.theme.dark,
// 			},
// 			invertDark: this.invertDark.value,
// 		}
// 	}

// 	dispose: () => void
// }

// /**
//  * A class containing all settings state.
//  * @reactive
//  */
// export const settings = new SettingsManager()
// export type { SettingsManager }
