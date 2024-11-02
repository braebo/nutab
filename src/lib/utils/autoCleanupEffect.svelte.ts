import { onDestroy } from 'svelte'
import { DEV } from 'esm-env'

/**
 * Behaves the same as `$effect.root`, but automatically
 * cleans up the effect inside Svelte components.
 *
 * @returns Cleanup function to manually cleanup the effect.
 */
export function autoCleanupEffect(fn: () => void | VoidFunction, verbose = true) {
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
				console.log('autoCleanupEffect: destroyed')
			}
		})
	} catch {
		if (verbose && DEV) {
			console.warn('Effect created outside Svelte component - manual cleanup required.')
		}
	}

	return destroy
}
