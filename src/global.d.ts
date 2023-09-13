/// <reference types="@sveltejs/kit" />
/// <reference lib="dom.iterable" />
/// <reference lib="vite/client" />
/// <reference lib="tippy.js" />
/// <reference lib="node" />
/// <reference lib="dom" />

// *Action types
// https://github.com/paolotiu/svelte-useactions/blob/main/src/index.ts

declare global {
	declare namespace svelte.JSX {
		interface HTMLProps<T> {
			onoutclick?: (event: import('fractils').ClickOutsideEvent) => void
		}
	}

	type ValueOf<T> = T[keyof T]

	/**
	 * Better Object.keys: https://fettblog.eu/typescript-better-object-keys
	 */
	type ObjectKeys<T> = T extends object
		? (keyof T)[]
		: T extends number
		? []
		: T extends Array<any> | string
		? string[]
		: never

	interface ObjectConstructor {
		keys<T>(o: T): ObjectKeys<T>
	}
}
