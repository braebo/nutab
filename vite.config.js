import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3333,
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})
