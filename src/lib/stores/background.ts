import { derived } from 'svelte/store'
import { theme } from 'fractils'
import { settings } from './'

export const gradientBackground = derived([settings, theme], ([$settings, $theme]) => {
	if ($settings.sharedTheme) {
		const opacity = $settings.theme.shared.gradientOpacity?.value?.toString(16) ?? '30'
		return `background-image: linear-gradient(to bottom, ${$settings.theme.shared.gradientA + opacity}, ${
			$settings.theme.shared.gradientB + opacity
		});`
	}
	if ($theme === 'dark') {
		const opacity = $settings.theme.dark.gradientOpacity?.value?.toString(16) ?? '30'
		return `background-image: linear-gradient(to bottom, ${$settings.theme.dark.gradientA + opacity}, ${
			$settings.theme.dark.gradientB + opacity
		});`
	}
	if ($theme === 'light') {
		const opacity = $settings.theme.light.gradientOpacity?.value?.toString(16) ?? '30'
		return `background-image: linear-gradient(to bottom, ${$settings.theme.light.gradientA + opacity}, ${
			$settings.theme.light.gradientB + opacity
		});`
	}
})
