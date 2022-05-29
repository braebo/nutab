// import adapter from 'sveltekit-adapter-browser-extension'
import adapter from 'sveltekit-adapter-chrome-extension'
// import adapter from '@sveltejs/adapter-vercel'
// import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: adapter(),
		// adapter: adapter({ fallback: 'index.html' }),
		appDir: 'ext', //* This is important - chrome extensions can't handle the default _app directory name.
		prerender: {
			default: true
		}
	}
}

export default config
