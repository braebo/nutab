/**
 * Type for a callback function that provides a boolean state and optional additional arguments.
 */
type SmoothCallback = (state: boolean, ...args: any[]) => void

/**
 * Returns a function to toggle a boolean with a smooth transition.
 *
 * @example
 * ```html
 * <script lang="ts">
 *   import { smoothToggle } from '$lib/utils/smoothToggle'
 *
 *   const toggle = smoothToggle(
 *     (state, speed: string) => {
 *       console.log(state ? 'on' : 'off', speed)
 *     },
 *     [10, 500]
 *   )
 * </script>
 *
 * <button onpointerenter={() => toggle(true, 'fast)}>Turn on</button>
 * <button onpointerleave={() => toggle(false, 'slow')}>Turn off</button>
 * ```
 */
export const smoothToggle = <T extends SmoothCallback>(
	/**
	 * The callback to call when the state changes.
	 */
	cb: T,
	/**
	 * The delay in `ms` for each state change.
	 * @default [500,0]
	 */
	[trueDelay, falseDelay]: [trueDelay?: number, falseDelay?: number] = [500, 0],
): T => {
	trueDelay ??= 500
	falseDelay ??= 0

	let onTimer: ReturnType<typeof setTimeout>
	let offTimer: ReturnType<typeof setTimeout>

	const set = ((state: boolean, ...args: any[]) => {
		clearTimeout(onTimer)
		clearTimeout(offTimer)

		const delay = state ? trueDelay : falseDelay

		if (state) {
			onTimer = setTimeout(() => {
				try {
					cb(state, ...args)
				} catch (e) {
					console.warn(e)
				}
			}, delay)
		} else {
			offTimer = setTimeout(() => {
				try {
					cb(state, ...args)
				} catch (e) {
					console.warn(e)
				}
			}, delay)
		}
	}) as T

	return set
}
