import { settings } from '$lib/stores'
import { get } from 'svelte/store'

export const addMissingSettings = () => {
	const s = get(settings)

	console.log({ s })
}
