import adapter from 'sveltekit-adapter-browser-extension'
import mdsvexConfig from './mdsvex.config.js'
import preprocess from 'svelte-preprocess'
import { mdsvex } from 'mdsvex'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	preprocess: [
		preprocess({
			postcss: true
		}),
		mdsvex(mdsvexConfig)
	],
	kit: {
		adapter: adapter(),
		appDir: 'ext' //* This is important - chrome extensions can't handle the default _app directory name.
	}
}

export default config
