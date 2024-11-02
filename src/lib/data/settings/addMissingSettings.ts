import { settings } from '$lib/stores/settings.svelte'
import { log } from '$lib/utils/log'

export const addMissingSettings = async () => {
	const s = settings

	try {
		for (const [key, value] of Object.entries(settings)) {
			if (!(key in s)) {
				log('Missing Setting Found:')
				log(`Adding missing setting: ${key}`)
				if (typeof key !== 'undefined') {
					// @ts-expect-error ...
					settings[key] = value
				}
			}
		}
	} catch (err) {
		log('Error adding missing settings:', 'tomato', 'black')
		log(err)
	}

	return true
}
