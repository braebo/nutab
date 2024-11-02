import type { ExtendedVars, Theme, ThemeDefinition, VariableDefinition } from './themer.types'

/**
 * Merges a partial theme definition into the base theme.
 * @param def - A partial theme definition to resolve into a full {@link Theme} object.
 * @param vars - Additional variables for extending the theme.
 */
export function resolveTheme(def: ThemeDefinition, vars: ExtendedVars = {}) {
	const color = {
		base: def.vars.color.base,
		dark: {
			'bg-a': def.vars.color.dark?.['bg-a'] || def.vars.color.base['dark-a'],
			'bg-b': def.vars.color.dark?.['bg-b'] || def.vars.color.base['dark-b'],
			'bg-c': def.vars.color.dark?.['bg-c'] || def.vars.color.base['dark-c'],
			'bg-d': def.vars.color.dark?.['bg-d'] || def.vars.color.base['dark-d'],
			'bg-e': def.vars.color.dark?.['bg-e'] || def.vars.color.base['dark-e'],
			'fg-a': def.vars.color.dark?.['fg-a'] || def.vars.color.base['light-a'],
			'fg-b': def.vars.color.dark?.['fg-b'] || def.vars.color.base['light-b'],
			'fg-c': def.vars.color.dark?.['fg-c'] || def.vars.color.base['light-c'],
			'fg-d': def.vars.color.dark?.['fg-d'] || def.vars.color.base['light-d'],
			'fg-e': def.vars.color.dark?.['fg-e'] || def.vars.color.base['light-e'],
			...def.vars.color.dark,
		},
		light: {
			'bg-a': def.vars.color.light?.['bg-a'] || def.vars.color.base['light-a'],
			'bg-b': def.vars.color.light?.['bg-b'] || def.vars.color.base['light-b'],
			'bg-c': def.vars.color.light?.['bg-c'] || def.vars.color.base['light-c'],
			'bg-d': def.vars.color.light?.['bg-d'] || def.vars.color.base['light-d'],
			'bg-e': def.vars.color.light?.['bg-e'] || def.vars.color.base['light-e'],
			'fg-a': def.vars.color.light?.['fg-a'] || def.vars.color.base['dark-a'],
			'fg-b': def.vars.color.light?.['fg-b'] || def.vars.color.base['dark-b'],
			'fg-c': def.vars.color.light?.['fg-c'] || def.vars.color.base['dark-c'],
			'fg-d': def.vars.color.light?.['fg-d'] || def.vars.color.base['dark-d'],
			'fg-e': def.vars.color.light?.['fg-e'] || def.vars.color.base['dark-e'],
			...def.vars.color.light,
		},
	} as VariableDefinition

	/** Final merged theme variables. */
	const v = deepMergeOpts([{ color }, vars, def.vars]) as ThemeDefinition['vars']

	const lightDarkColors = {
		'--theme-a': `light-dark(${v.color.light['theme-a'] ?? v.color.base['theme-a']}, ${v.color.dark['theme-a'] ?? v.color.base['theme-a']})`,
		'--theme-b': `light-dark(${v.color.light['theme-b'] ?? v.color.base['theme-b']}, ${v.color.dark['theme-b'] ?? v.color.base['theme-b']})`,
		'--theme-c': `light-dark(${v.color.light['theme-c'] ?? v.color.base['theme-c']}, ${v.color.dark['theme-c'] ?? v.color.base['theme-c']})`,
		'--bg-a': `light-dark(${v.color.light['bg-a']}, ${v.color.dark['bg-a']})`,
		'--bg-b': `light-dark(${v.color.light['bg-b']}, ${v.color.dark['bg-b']})`,
		'--bg-c': `light-dark(${v.color.light['bg-c']}, ${v.color.dark['bg-c']})`,
		'--bg-d': `light-dark(${v.color.light['bg-d']}, ${v.color.dark['bg-d']})`,
		'--bg-e': `light-dark(${v.color.light['bg-e']}, ${v.color.dark['bg-e']})`,
		'--fg-a': `light-dark(${v.color.light['fg-a']}, ${v.color.dark['fg-a']})`,
		'--fg-b': `light-dark(${v.color.light['fg-b']}, ${v.color.dark['fg-b']})`,
		'--fg-c': `light-dark(${v.color.light['fg-c']}, ${v.color.dark['fg-c']})`,
		'--fg-d': `light-dark(${v.color.light['fg-d']}, ${v.color.dark['fg-d']})`,
		'--fg-e': `light-dark(${v.color.light['fg-e']}, ${v.color.dark['fg-e']})`,
		'--light-a': v.color.light['bg-a'],
		'--light-b': v.color.light['bg-b'],
		'--light-c': v.color.light['bg-c'],
		'--light-d': v.color.light['bg-d'],
		'--light-e': v.color.light['bg-e'],
		'--dark-a': v.color.dark['bg-a'],
		'--dark-b': v.color.dark['bg-b'],
		'--dark-c': v.color.dark['bg-c'],
		'--dark-d': v.color.dark['bg-d'],
		'--dark-e': v.color.dark['bg-e'],
	}

	const theme: Theme = {
		title: def.title,
		prefix: def.prefix || 'fractils',
		// vars: deepMergeOpts([{ color }, vars, def.vars]) as Theme['vars'],
		vars: {
			...v,
			color: lightDarkColors,
		},
		resolved: true,
	}

	return theme
}

/**
 * Deep merges objects together, with some special rules:
 * - Arrays are concatenated and de-duplicated unless {@link concatArrays|`concatArrays`} is `false`.
 * - Objects are recursively merged.
 * - `false` is only replaced with `true`
 * - An object is never replaced with `true`, `false`, or `undefined`.
 * - The original objects are not mutated.
 * - `undefined` is always overwritten.
 * - `0` is accepted.
 */
function deepMergeOpts<T, U>(
	objects: [target: T, ...sources: U[]],
	options?: {
		/**
		 * If `true`, arrays are concatenated and de-duplicated.
		 *
		 * If `false`, arrays are replaced.
		 * @defaultValue `false`
		 */
		concatArrays?: boolean
	},
): T & U {
	const [target, ...sources] = objects
	const { concatArrays = true } = options ?? {}

	return sources.reduce<T & U>(
		(acc, curr) => {
			if (!curr) return acc

			const keys = Object.keys(curr)
			for (let i = 0; i < keys.length; i++) {
				const k = keys[i] as keyof T & U
				const v = acc[k]
				const newV = curr[k as keyof U] as (T & U)[keyof T & U] | undefined

				if (Array.isArray(v) && Array.isArray(newV)) {
					if (concatArrays) {
						acc[k] = [...new Set([...v, ...newV])] as (T & U)[keyof T & U]
					} else {
						acc[k] = newV
					}
				} else if (v && typeof v === 'object') {
					if (newV !== true) {
						if (newV && typeof newV === 'object') {
							if (
								typeof globalThis.window !== 'undefined' &&
								newV instanceof Element
							) {
								acc[k] = newV
							} else {
								acc[k] = deepMergeOpts([{ ...v }, newV], options)
							}
						} else if (newV || newV === false) {
							acc[k] = newV
						}
					}
				} else if (newV !== undefined) {
					acc[k] = newV
				}
			}
			return acc
		},
		{ ...target } as T & U,
	)
}
