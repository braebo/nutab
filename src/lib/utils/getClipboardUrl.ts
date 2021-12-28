import { browser } from '$app/env'

export const getClipboardUrl = (): string => {
	if (!browser) return 'err'
	navigator?.permissions?.query({ name: 'clipboard-read' }).then((result) => {
		// If permission to read the clipboard is granted or if the user will
		// be prompted to allow it, we proceed.

		if (result.state == 'granted' || result.state == 'prompt') {
			navigator.clipboard.readText().then((data) => {
				console.table(data)
				if (data.startsWith('http')) {
					return data
				}
			})
		} else return 'err'
	})
}
