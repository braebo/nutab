let overTimer: NodeJS.Timeout

/**
 * Debounced event
 * @param cb Callback to run  (will cancel smoothOut)
 * @param delay delay in ms
 * @param bypass optionally cancel the debounce
 */
async function smoothOver(cb: Function, delay = 500, bypass?: boolean) {
	if (bypass) return
	clearTimers()
	overTimer = setTimeout(() => {
		try {
			cb()
		} catch (e) {
			console.warn(e)
		}
	}, delay)
}

let outTimer: NodeJS.Timeout
/**
 * Debounced event
 * @param cb Callback to run  (will cancel smoothOver)
 * @param delay delay in ms
 * @param bypass optionally cancel the debounce
 */
async function smoothOut(cb: Function, delay = 300, bybass?: boolean) {
	clearTimers()
	outTimer = setTimeout(() => {
		try {
			cb()
		} catch (e) {
			console.warn(e)
		}
	}, delay)
}

export const smoothHover = {
	smoothOver,
	smoothOut
}

const clearTimers = () => [outTimer, overTimer].forEach((t) => clearTimeout(t))
