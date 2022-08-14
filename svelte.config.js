import browser_extension from 'sveltekit-adapter-browser-extension'
import vercel from '@sveltejs/adapter-vercel'
import preprocess from 'svelte-preprocess'

const adapters = [
	vercel(),
	browser_extension({ fallback: 'index.html' })
]

const hybrid_adapter = () => ({
	name: 'hybrid',
	async adapt(argument) {
		await Promise.all(adapters.map(adapter =>
			Promise.resolve(adapter).then(resolved => resolved.adapt(argument))
		))
	}
})

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: hybrid_adapter(),
		appDir: 'ext', //* This is important - chrome extensions can't handle the default _app directory name.
		prerender: {
			default: true
		}
	},
	vitePlugin: {
		experimental: {
			// https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md#inspector
			inspector: {
				toggleButtonPos: 'bottom-left',
				toggleKeyCombo: 'meta-shift',
				showToggleButton: 'always',
				holdMode: true
			}
		}
	}
}

export default config
