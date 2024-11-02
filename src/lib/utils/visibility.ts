import type { Action } from 'svelte/action'

export interface VisibilityEvents {
	/**
	 * Triggered when element enters or leaves view.
	 */
	'onv-change': (event: CustomEvent<VisibilityEventDetail>) => void
	/**
	 * Triggered when element enters view.
	 */
	'onv-enter': (event: CustomEvent<VisibilityEventDetail>) => void
	/**
	 * Triggered when element exits view.
	 */
	'onv-exit': (event: CustomEvent<VisibilityEventDetail>) => void
}

export interface VisibilityEventDetail {
	isVisible: boolean
	entry: IntersectionObserverEntry
	scrollDirection: {
		vertical: 'up' | 'down' | undefined
		horizontal: 'left' | 'right' | undefined
	}
}

export interface VisibilityOptions {
	/**
	 * The root view (default: window)
	 * @default null
	 */
	view: Element | Document | null
	/**
	 * Margin around root view - 'px' or '%' (default: '0px')
	 * @default '0px'
	 */
	margin: string
	/**
	 * % of pixels required in view to trigger event.  An array will trigger multiple events - '0-1' (default: 0)
	 * @default 0
	 */
	threshold: number
	/**
	 * Whether to dispatch events only once (default: false)
	 * @default false
	 */
	once: boolean
}

const defaultOptions: VisibilityOptions = {
	view: null,
	margin: '0px',
	threshold: 0,
	once: false,
}

const dispatch = (node: HTMLElement, name: string, detail: VisibilityEventDetail) => {
	node.dispatchEvent(new CustomEvent(name, { detail }))
}

/**
 * Observes an element's current viewport visibility and dispatches relevant events.
 *
 * @example
 *```svelte
 * <div
 * 	use:visibility={options}
 * 	on:v-change={handleChange}
 * 	on:v-enter={doSomething}
 * 	on:v-exit={doSomethingElse}
 * 	class:visible
 * >
 * 	{scrollDir}
 * </div>
 *```
 */
export const visibility: Action<
	HTMLElement,
	Partial<VisibilityOptions> | undefined,
	VisibilityEvents
> = (node, options = defaultOptions) => {
	const { view, margin, threshold, once } = Object.assign({}, defaultOptions, options)

	const prevPos = {
		x: undefined as number | undefined,
		y: undefined as number | undefined,
	}

	const scrollDirection = {
		vertical: undefined as 'up' | 'down' | undefined,
		horizontal: undefined as 'left' | 'right' | undefined,
	}

	if (typeof IntersectionObserver !== 'undefined' && node) {
		const observer = new IntersectionObserver(
			(entries, _observer) => {
				const observe = _observer.observe
				const unobserve = _observer.unobserve
				entries.forEach((singleEntry) => {
					const entry = singleEntry
					if (prevPos.y && prevPos.y > entry.boundingClientRect.y) {
						scrollDirection.vertical = 'down'
					} else {
						scrollDirection.vertical = 'up'
					}
					if (prevPos.x && prevPos.x > entry.boundingClientRect.x) {
						scrollDirection.horizontal = 'left'
					} else {
						scrollDirection.horizontal = 'right'
					}

					prevPos.y = entry.boundingClientRect.y
					prevPos.x = entry.boundingClientRect.x

					const detail = {
						isVisible: entry.isIntersecting,
						entry,
						scrollDirection,
						observe,
						unobserve,
					}
					dispatch(node, 'v-change', detail)
					if (entry.isIntersecting) {
						dispatch(node, 'v-enter', detail)
						if (once) _observer.unobserve(node)
					} else {
						dispatch(node, 'v-exit', detail)
					}
				})
			},
			{
				root: view,
				rootMargin: margin,
				threshold,
			},
		)
		observer.observe(node)
		return {
			destroy() {
				observer.unobserve(node)
			},
		}
	}
	return {}
}
