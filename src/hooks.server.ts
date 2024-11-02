type Theme = 'light' | 'dark' | 'system'

export async function handle({ event, resolve }) {
	// Set the page theme
	const theme = (event.cookies.get('theme') as Theme) ?? 'dark'
	if (['dark', 'light', 'system'].includes(theme)) {
		event.locals.theme = theme ?? 'dark'
	}

	let page = ''
	return resolve(event, {
		transformPageChunk: ({ html, done }) => {
			page += html
			if (done) return page.replace('%nutab.theme%', event.locals.theme)
		},
	})
}
