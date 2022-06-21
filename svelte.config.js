import extension from 'sveltekit-adapter-browser-extension'
import vercel from '@sveltejs/adapter-vercel'
import preprocess from 'svelte-preprocess'

const hybrid = () => {
	const adapters = [extension({ fallback: 'index.html' }), vercel()]
    return {
        name: 'hybrid',
        async adapt(argument) {
            await Promise.all(adapters.map(item =>
                Promise.resolve(item).then(resolved => resolved.adapt(argument))
            ))
        }
    }
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: hybrid(),
		appDir: 'ext', //* This is important - chrome extensions can't handle the default _app directory name.
		prerender: {
			default: true
		}
	}
}

export default config
