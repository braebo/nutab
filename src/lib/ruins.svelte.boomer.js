/**
 * @template T
 * @param {T} value
 */
export const state = (value) => {
	return new (class {
		value = $state({ value })
	})()
}

/**
 * @template T
 * @param {() => T} fn
 */
export function derived(fn) {
	return new (class {
		value = $derived.by(fn)
	})()
}
