// import type { KeyboardEventKey } from './keyboardEvents'

import type { Hotkey, OnClickAction } from './onClick.types'

export type HotkeyModifiers =
	| 'shift'
	| 'alt'
	| 'option'
	| 'meta'
	| 'cmd'
	| 'command'
	| 'ctrl'
	| 'control'

type HotkeyDefinition = {
	keys: string[]
	modifiers: {
		meta: boolean
		shift: boolean
		ctrl: boolean
		alt: boolean
	}
}

/**
 * A svelte action that combines a click and keydown event.
 */
export const click: OnClickAction = (
	node,
	options = {
		hotkey: ['Enter', 'Space'],
	},
) => {
	if (node.tagName.toLowerCase() !== 'button') {
		if (!node.getAttribute('tabindex')) node.setAttribute('tabindex', '0')
	}

	let hotkeys: HotkeyDefinition[] = []

	node.removeEventListener('click', handleClick as EventListener)
	node.addEventListener('click', handleClick as EventListener)

	window.removeEventListener('keydown', handleKeydown)
	window.addEventListener('keydown', handleKeydown)

	updateHotkey(options.hotkey)

	function handleClick(event: MouseEvent & { target: typeof node }): void {
		node.dispatchEvent(new CustomEvent('Click', { detail: event }))
		options?.onClick?.(event)
		options?.fn?.(event)
	}

	function handleKeydown(e: KeyboardEvent) {
		if (hotkeys.length === 0) return
		if (options.disableHotkey) return

		for (const hotkey of hotkeys) {
			if (
				hotkey.modifiers.meta === e.metaKey &&
				hotkey.modifiers.shift === e.shiftKey &&
				hotkey.modifiers.ctrl === e.ctrlKey &&
				hotkey.modifiers.alt === e.altKey &&
				hotkey.keys.includes(e.key)
			) {
				node.dispatchEvent(new CustomEvent('Hotkey', { detail: e }))
				options.fn?.(e)
				break
			}
		}
	}

	/**
	 * Parses hotkey options and updates {@link hotkeys} and {@link modifiers}.
	 */
	function updateHotkey(hotkey?: Hotkey | Hotkey[]): void {
		if (!hotkey) return
		hotkeys = createHotkeys(hotkey)
	}

	return {
		update(newOptions) {
			options = newOptions
			updateHotkey(newOptions.hotkey)
		},
		destroy() {},
	}
}

export function createHotkeys(hotkey: Hotkey | Hotkey[]): HotkeyDefinition[] {
	const hotkeyArray: Hotkey[] = Array.isArray(hotkey) ? hotkey : [hotkey]

	return hotkeyArray.map((key) => {
		const result: HotkeyDefinition = {
			keys: [],
			modifiers: {
				meta: false,
				shift: false,
				ctrl: false,
				alt: false,
			},
		}

		const keyParts = typeof key === 'string' ? key.split('+') : key

		for (const part of keyParts) {
			switch (part.toLowerCase()) {
				case 'meta':
				case 'cmd':
				case 'command':
					result.modifiers.meta = true
					break
				case 'shift':
					result.modifiers.shift = true
					break
				case 'ctrl':
				case 'control':
					result.modifiers.ctrl = true
					break
				case 'alt':
				case 'option':
					result.modifiers.alt = true
					break
				default:
					result.keys.push(part)
			}
		}

		return result
	})
}
