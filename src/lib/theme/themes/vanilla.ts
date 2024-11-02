import type { ThemeDefinition } from '../themer.types'

import { resolveTheme } from '../resolveTheme'

export default resolveTheme({
	title: 'vanilla',
	prefix: 'gooey',
	vars: {
		color: {
			base: {
				'theme-a': '#ff4700',
				'theme-b': '#ffcebe',
				'theme-c': '#ffece6',
				'dark-a': '#0b0e11',
				'dark-b': '#1c1e21',
				'dark-c': '#1d252e',
				'dark-d': '#4a4a55',
				'dark-e': '#787b89',
				'light-a': '#ffffff',
				'light-b': '#dfe1e9',
				'light-c': '#c3c4c7',
				'light-d': '#acacb4',
				'light-e': '#5F6377',
			},
			dark: {},
			light: {},
		},
	},
} as const satisfies ThemeDefinition)
