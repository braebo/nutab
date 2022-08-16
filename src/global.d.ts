/// <reference types="@sveltejs/kit" />

// *Action types
// https://github.com/paolotiu/svelte-useactions/blob/main/src/index.ts

/**
 * The return type of an action.
 */
export type ActionReturn<Params> = {
	destroy?: () => void
	update?: (params: Params) => void
} | void

/**
 * Action type shim
 */
export type ActionLike<Node extends HTMLElement> = (node: Node, params: any) => any

/**
 * A primitive Action
 */
export type Action<Node extends HTMLElement = HTMLElement, Params extends any = undefined> = (
	node: Node,
	params?: Params,
) => ActionReturn<Params>

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
