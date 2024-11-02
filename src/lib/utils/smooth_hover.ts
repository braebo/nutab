/**
 *
 * @param node The element consuming the action.
 * @param bool Optionally toggle a bool automatically.
 */

import type { Action } from 'svelte/action'

export const smooth_hover: Action = (node: HTMLElement, bool?: boolean) => {
	let overTimer: ReturnType<typeof setTimeout>
	function smoothOver(_e: Event, delay = 500, bypass = false) {
		if (bypass) return
		clearTimers()
		overTimer = setTimeout(() => {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			bool ? (bool = !bool) : null
			node.dispatchEvent(new CustomEvent('hoverOn'))
		}, delay)
	}

	let outTimer: ReturnType<typeof setTimeout>
	function smoothOut(_e: Event, delay = 300) {
		clearTimers()
		outTimer = setTimeout(() => {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			bool ? (bool = !bool) : null
			node.dispatchEvent(new CustomEvent('hoverOff'))
		}, delay)
	}

	node.addEventListener('mouseout', smoothOver, true)
	node.addEventListener('mouseover', smoothOver, true)

	function clearTimers() {
		;[outTimer, overTimer].forEach((t) => clearTimeout(t))
	}

	return {
		destroy() {
			node.removeEventListener('mouseover', smoothOver, true)
			node.removeEventListener('mouseout', smoothOut, true)
		},
	}
}
