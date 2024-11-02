/// <reference types="vitest" />

import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	// server: { port: 3333 },
	// silence warnings - https://sass-lang.com/documentation/breaking-changes/legacy-js-api
	css: { preprocessorOptions: { scss: { api: 'modern' } } },
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})
