import { persist } from '$lib/utils/persist.svelte'

export const deepState = persist('deepState', {
	data: {
		foo: 'bar',
		baz: {
			qux: 'quux',
		},
	},
	test: 123,
})
