import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import adapter_vercel from '@sveltejs/adapter-vercel'
import { sveltePreprocess } from 'svelte-preprocess'
import adapter_auto from '@sveltejs/adapter-auto'
import browser_extension from './adapter.js'

const vercel = !!process.env.VERCEL
const extension = !!process.env.BROWSER_EXTENSION

const adapter = vercel
	? adapter_vercel()
	: extension
		? browser_extension({ fallback: 'index.html' })
		: adapter_auto()

const ignoreWarnings = ['a11y-click-events-have-key-events']

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess(),
		sveltePreprocess({
			pug: true,
			scss: true,
		}),
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
	// @ts-expect-error - Why isn't this typed?
	onwarn: (warning, handler) => {
		// if (warning.code.startsWith('a11y-')) {
		if (ignoreWarnings.includes(warning.code)) {
			return
		}
		handler(warning)
	},
	warningFilter: (ree) => !ree.code.startsWith('a11y'),
}

export default config
