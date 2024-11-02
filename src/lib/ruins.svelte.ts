import { onDestroy } from 'svelte'
import { DEV } from 'esm-env'

export function state<T>(value: T) {
	return new (class rune {
		value = $state({ value })
	})()
}

/**
 * `$derived`, except it's correctly typed and can be initialized anywhere.
 */
export function derived<T>(fn: () => T) {
	return new (class rune {
		value = $derived.by(fn)
	})()
}

/**
 * `$effect`, except it creates a root if needed, and cleans it up automatically in Svelte
 * components.
 */
export function effect(fn: () => void, verbose = true) {
	if (!$effect.tracking()) {
		return effectRoot(() => {
			$effect(fn)
		}, verbose)
	} else {
		$effect(fn)
	}
	return () => {}
}

/**
 * `$effect.root` that automatically cleans up the effect inside Svelte components.
 *
 * @returns Cleanup function to manually cleanup the effect.
 */
export function effectRoot(fn: () => void, verbose = true) {
	let cleanup: VoidFunction | null = $effect.root(fn)

	function destroy() {
		if (cleanup === null) {
			return
		}

		cleanup()
		cleanup = null
	}

	try {
		onDestroy(() => {
			destroy()
			if (verbose && DEV) {
				console.log('%croot: destroyed', 'color:tomato')
			}
		})
	} catch {
		if (verbose && DEV) {
			console.warn('Effect created outside Svelte component - manual cleanup required.')
		}
	}

	return destroy
}
