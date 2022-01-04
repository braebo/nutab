/// <reference types="@sveltejs/kit" />

/**
 * https://github.com/paolotiu/svelte-useactions/blob/main/src/index.ts
 * *Action types
 */

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
	params?: Params
) => ActionReturn<Params>
