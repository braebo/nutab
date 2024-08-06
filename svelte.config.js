import sveltePreprocess from 'svelte-preprocess'
import vercel from '@sveltejs/adapter-vercel'
import browser_extension from './adapter.js'

const adapter = !!process.env.VERCEL ? vercel() : browser_extension({ fallback: 'index.html' })

const ignoreWarnings = ['a11y-click-events-have-key-events']

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		sveltePreprocess()
	],
	kit: {
		adapter,
		appDir: 'ext', //* This is important - chrome extensions can't handle the default _app directory name.
	},
	vitePlugin: {
		inspector: {
			toggleButtonPos: 'bottom-left',
			toggleKeyCombo: 'meta-shift',
			showToggleButton: 'always',
			holdMode: true,
		},
	},
	onwarn: (warning, handler) => {
		// if (warning.code.startsWith('a11y-')) {
		if (ignoreWarnings.includes(warning.code)) {
			return
		}
		handler(warning)
	},
}

export default config
