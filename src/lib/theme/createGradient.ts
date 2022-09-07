import type { ThemeSettings } from '$lib/stores/settingsStore'

import { settings, type Settings } from '$lib/stores'

import { get } from 'svelte/store'

export const createGradient = (theme: keyof Settings['theme']) => {
	const t = get(settings).theme[theme]
	const opacity = t.gradientOpacity?.value?.toString(16) ?? '30'
	return gradient(t, opacity)
}

export const createActiveGradient = (t: ThemeSettings) => {
	const opacity = t.gradientOpacity?.value?.toString(16) ?? '30'
	return gradient(t, opacity)
}

const gradient = (t: ThemeSettings, opacity: string) => {
	return `background-image: linear-gradient(to bottom, ${t.gradientA + opacity}, ${t.gradientB + opacity});`
}
