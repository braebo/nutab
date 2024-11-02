import type { ThemeConfig } from '$lib/data/types'

import { settings } from '$lib/stores/settings.svelte'

export const createGradient = (theme: keyof typeof settings.theme) => {
	const t = settings.theme[theme]
	const opacity = t?.gradientOpacity?.toString(16) ?? '30'
	return gradient(t, opacity)
}

export const createActiveGradient = (t: ThemeConfig) => {
	const opacity = t?.gradientOpacity?.toString(16) ?? '30'
	return gradient(t, opacity)
}

const gradient = (t: ThemeConfig | undefined, opacity: string) => {
	return `background-image: linear-gradient(to bottom, ${t?.gradientA + opacity}, ${t?.gradientB + opacity});`
}
