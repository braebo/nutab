import { settings, type Settings } from '$lib/stores'

import { get } from 'svelte/store'

export const createGradient = (theme: keyof Settings['theme']) => {
	const t = get(settings).theme[theme]
	const opacity = t.gradientOpacity?.value?.toString(16) ?? '30'
	return `background-image: linear-gradient(to bottom, ${t.gradientA + opacity}, ${t.gradientB + opacity});`
}
