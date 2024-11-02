import type { ActionReturn } from 'svelte/action'

export type OnClickAction<
	T extends HTMLElement | SVGElement = HTMLElement | SVGElement,
	O extends OnClickOpts<T> = OnClickOpts<T>,
> = (node: T, options?: O) => ActionReturn<O, OnClickEvents<T>>

/**
 * A combination of {@link https://developer.mozilla.org/docs/Web/API/KeyboardEvent/key | event.key} values and {@link KeyboardModifier | keyboard modifiers} separated by `+`.
 * - modifiers: `meta | shift | ctrl | alt`
 * - keys: any valid {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values|keyboard event key}
 * @example
 * ```ts
 * 'ctrl+z'
 * 'meta+shift+ArrowDown'
 * ```
 */
export type Hotkey = KeyboardEventKey | (string & {})

export interface OnClickOpts<T extends HTMLElement | SVGElement> {
	/**
	 * A callback to run on click or hotkey events.
	 */
	fn?: (e: (MouseEvent & { target: T }) | KeyboardEvent) => void
	/**
	 * A hotkey definition or array of hotkey definitions.
	 * @example
	 * ```ts
	 * 'ctrl+shift+z'
	 * ['ctrl+a', 'shift+b']
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <!-- Usage -->
	 * <div use:onClick={{ hotkey: 'meta+alt+a' }} />
	 * <div use:onClick={{ hotkey: { key: 'a', ctrl: true, alt: true } }} />
	 * ```
	 */
	hotkey?: Hotkey | Hotkey[]
	/**
	 * Whether the hotkey should be disabled.
	 * @default false
	 */
	disableHotkey?: boolean
	/**
	 * Whether the click event should be disabled.
	 * @default false
	 */
	disableClick?: boolean
	/**
	 * Only fires on click events.
	 */
	onClick?: (e: MouseEvent & { target: T }) => void
	/**
	 * Only fires on hotkey events.
	 */
	onHotkey?: (e: KeyboardEvent) => void
}

export interface OnClickEvents<T extends HTMLElement | SVGElement> {
	/**
	 * Fires on click events.
	 */
	// onClick?: (e: MouseEvent & { target: T }) => void
	onClick?: (e: { detail: MouseEvent & { target: T } }) => void
	/**
	 * Fires if a hotkey is pressed.
	 */
	onHotkey?: (e: { detail: KeyboardEvent }) => void
}

/**
 * A subset of {@link KeyboardEvent.key} values.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 */
export type KeyboardEventKey =
	| ModifierKeys
	| WhitespaceKeys
	| NavigationKeys
	| EditingKeys
	| FunctionKeys
	| NumericKeypadKeys
	| UpperAlpha
	| LowerAlpha

export type NumericKeypadKeys =
	| 'Decimal'
	| 'Key11'
	| 'Key12'
	| 'Multiply'
	| 'Add'
	| 'Clear'
	| 'Divide'
	| 'Subtract'
	| 'Separator'
	| '0'
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'

export type LowerAlpha =
	| 'a'
	| 'b'
	| 'c'
	| 'd'
	| 'e'
	| 'f'
	| 'g'
	| 'h'
	| 'i'
	| 'j'
	| 'k'
	| 'l'
	| 'm'
	| 'n'
	| 'o'
	| 'p'
	| 'q'
	| 'r'
	| 's'
	| 't'
	| 'u'
	| 'v'
	| 'w'
	| 'x'
	| 'y'
	| 'z'

export type UpperAlpha = Uppercase<LowerAlpha>

export type ModifierKeys =
	| 'Alt'
	| 'AltGraph'
	| 'CapsLock'
	| 'Control'
	| 'Fn'
	| 'FnLock'
	| 'Hyper'
	| 'Meta'
	| 'NumLock'
	| 'ScrollLock'
	| 'Shift'
	| 'Super'
	| 'Symbol'
	| 'SymbolLock'

export type WhitespaceKeys = 'Enter' | 'Tab' | ' '

export type NavigationKeys =
	| 'ArrowDown'
	| 'ArrowLeft'
	| 'ArrowRight'
	| 'ArrowUp'
	| 'End'
	| 'Home'
	| 'PageDown'
	| 'PageUp'

export type EditingKeys = 'Backspace' | 'Delete'

export type FunctionKeys =
	| 'F1'
	| 'F2'
	| 'F3'
	| 'F4'
	| 'F5'
	| 'F6'
	| 'F7'
	| 'F8'
	| 'F9'
	| 'F10'
	| 'F11'
	| 'F12'
	| 'F13'
	| 'F14'
	| 'F15'
	| 'F16'
	| 'F17'
	| 'F18'
	| 'F19'
	| 'F20'
	| 'Soft1'
	| 'Soft2'
	| 'Soft3'
	| 'Soft4'
