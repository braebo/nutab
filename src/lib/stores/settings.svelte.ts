// import type { ThemeConfig } from '$lib/data/types'

import { createActiveGradient } from '$lib/theme_og/createGradient'
import { defaultThemeConfigs } from '$lib/data/defaultThemeConfigs'
// import { defaultFolder } from '$lib/data/bookmarks/defaults'
import { persist } from '$lib/utils/persist.svelte'
import { themer } from '$lib/theme/themer.svelte'
import { derived } from '$lib/ruins.svelte'

export const cMenu = $state({
	visible: false,
	x: 0,
	y: 0,
	el: null as unknown as HTMLElement,
	pending: false,
})

export type Settings = typeof settings

export const settings = persist('nutab:settings', {
	email: '',
	// activeFolderId: defaultFolder.folder_id,
	ranges: {
		gridWidth: 1300,
		gridGap: 50,
		iconSize: 45,
	},
	transparent: true,
	showTitle: false,
	sharedTheme: false,
	theme: defaultThemeConfigs(),
	invertDark: false,
	showSettings: false,
})

// export const activeTheme = new (class {
// 	value = $derived.by(() => {
// 		if (settings.sharedTheme) {
// 			return settings.theme.shared
// 		}
// 		return settings.theme[themer.mode]
// 	})
// })() as { value: ThemeConfig }

export const activeTheme = derived(() => {
	if (settings.sharedTheme) {
		return settings.theme.shared
	}
	return settings.theme[themer.mode]
})

export const activeBackground = derived(() => createActiveGradient(activeTheme.value))
