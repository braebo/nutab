import { onDestroy } from 'svelte'

type Primitive = string | null | symbol | boolean | number | undefined | bigint

const isPrimitive = (thing: unknown): thing is Primitive => {
	return thing !== Object(thing) || thing === null
}

/**
 * State persisted to `localStorage`.
 */
export type Persisted<T> = T extends Primitive ? { value: T } : T

/**
 * Creates a `$state` rune that's automatically persisted to `localStorage`.
 */
export function persist<T>(key: string, initial: T) {
	const existing = localStorage.getItem(key)

	const primitive = isPrimitive(initial)
	const parsed_value = existing ? JSON.parse(existing) : initial

	const state = $state<T extends Primitive ? { value: T } : T>(
		primitive ? { value: parsed_value } : parsed_value,
	)

	effect(() => {
		localStorage.setItem(key, JSON.stringify(primitive ? (state as { value: T }).value : state))
	})

	return state
}

/**
 * Internal effect implementation that creates a root if needed and handles cleanup when
 * used within a Svelte component lifecycle.
 */
function effect(fn: () => void) {
	if (!$effect.tracking()) {
		let cleanup: VoidFunction | null = $effect.root(fn)

		function destroy() {
			if (cleanup === null) return
			cleanup()
			cleanup = null
		}

		try {
			onDestroy(() => {
				destroy()
			})
		} catch {
			// Outside of Svelte components, the user is responsible for calling destroy.
		}

		return destroy
	} else {
		$effect(fn)
		return () => {}
	}
}
