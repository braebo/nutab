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
