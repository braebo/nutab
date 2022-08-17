import vercel from '@sveltejs/adapter-vercel'
import browser_extension from './adapter.js'
import preprocess from 'svelte-preprocess'

const adapter = !!process.env.VERCEL ? vercel() : browser_extension({ fallback: 'index.html' })

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
		prerender: {
			default: true,
		},
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
}

export default config
