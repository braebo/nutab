import { awesomePugPre, awesomePugPost } from 'svelte-awesome-pug'
// import { vitePreprocess } from '@sveltejs/kit/vite'
import vercel from '@sveltejs/adapter-vercel'
import browser_extension from './adapter.js'
import preprocess from 'svelte-preprocess'

const adapter = !!process.env.VERCEL ? vercel() : browser_extension({ fallback: 'index.html' })

const ignoreWarnings = ['a11y-click-events-have-key-events']

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		awesomePugPre,
		// vitePreprocess(),
		/** @type {import('vite-plugin-svelte').preprocess} */
		preprocess({
			pug: true,
			scss: true,
			sass: true,
		}),
		awesomePugPost,
	],
	kit: {
		adapter,
		appDir: 'ext', //* This is important - chrome extensions can't handle the default _app directory name.
	},
	vitePlugin: {
		inspector: {
			toggleButtonPos: 'bottom-left',
			toggleKeyCombo: 'control-meta',
			showToggleButton: 'active',
			holdMode: true,
		},
	},
	onwarn: (warning, handler) => {
		if (ignoreWarnings.includes(warning.code)) {
			return
		}
		handler(warning)
	},
}

export default config
