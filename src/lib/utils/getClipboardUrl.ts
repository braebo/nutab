import { browser } from '$app/environment'
import { log } from 'fractils'

export const getClipboardUrl = async (): Promise<string> => {
	if (!browser) return ''
	let url = ''
	// @ts-ignore
	const perm = await navigator?.permissions?.query({ name: 'clipboard-read' })

	// If permission to read the clipboard is granted or if the user will
	// be prompted to allow it, we proceed.
	if (perm.state == 'granted' || perm.state == 'prompt') {
		const contents = await navigator.clipboard.readText()

		try {
			const toUrl = new URL(contents)
			url = String(toUrl)
		} catch (e) {
			log(e)
		}

		// HACK: Can do batter than this
		if (contents.length < 100) url = contents
	}
	return url
}
