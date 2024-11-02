/**
 * A callback function wrapped in a debounce timer.
 */
type DebouncedCallback = (...args: any[]) => void

/**
 * A function that cancels the debounce when called.
 */
type CancelDebounce = () => void

/**
 * Debounced event
 * @param cb Callback to run  (will cancel smoothOut)
 * @param delay delay in ms
 * @param bypass optionally cancel the debounce
 * @returns The debounced callback and a cancel function.
 */
export const debounce = <T extends DebouncedCallback>(
	cb: T,
	delay = 500,
	bypass?: boolean,
): [T, CancelDebounce] => {
	let overTimer: ReturnType<typeof setTimeout>
	return [
		((...args) => {
			if (bypass) return
			clearTimeout(overTimer)
			overTimer = setTimeout(() => {
				if (bypass) return
				try {
					cb(...args)
				} catch (e) {
					console.warn(e)
				}
			}, delay)
		}) as T,
		() => clearTimeout(overTimer),
	]
}

// // Example usage
// const [debounceShowEditIcon] = debounce((i: number) => toggleShowEditIcon(true, i), 500)
// function handleItemMouseOver(i: number) {
// 	hovering = i
// 	debounceShowEditIcon(i)
// }
