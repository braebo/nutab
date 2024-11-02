// https://github.com/PuruVJ/macos-web/blob/main/src/state/persisted.svelte.ts

// import { autoCleanupEffect } from './autoCleanupEffect.svelte'
import { effect } from '$lib/ruins.svelte'

type Primitive = string | null | symbol | boolean | number | undefined | bigint

const isPrimitive = (thing: unknown): thing is Primitive => {
	return thing !== Object(thing) || thing === null
}

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

export type Persisted<T> = T extends Primitive ? { value: T } : T
