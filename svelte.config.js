import vercel from '@sveltejs/adapter-vercel'
import browser_extension from './adapter.js'
import preprocess from 'svelte-preprocess'

const adapter = !!process.env.VERCEL ? vercel() : browser_extension({ fallback: 'index.html' })

const ignoreWarnings = ['a11y-click-events-have-key-events']

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
	kit: {
		adapter,
		appDir: 'ext', //* This is important - chrome extensions can't handle the default _app directory name.
	},
	vitePlugin: {
		experimental: {
			// https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md#inspector
			inspector: {
				toggleButtonPos: 'bottom-left',
				toggleKeyCombo: 'meta-shift',
				/** @type {'always' | 'active' | 'never'} */
				showToggleButton: 'active',
				holdMode: true,
			},
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
