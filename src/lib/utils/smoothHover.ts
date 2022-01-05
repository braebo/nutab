const clearTimers = () => [outTimer, overTimer].forEach((t) => clearTimeout(t))

const run = (cb: unknown) => {
	if (typeof cb === 'function') cb()
	else if (typeof cb === 'boolean') cb = !cb
	else console.error('{smoothOver} cb: function | boolean cannot be ' + typeof cb)
}

let overTimer: NodeJS.Timeout

/**
 * Debounced hover event
 * @param cb Callback to run, or boolean to make true
 * @param delay delay in ms
 * @param bypass optionally cancel the debounce
 */
function smoothOver(cb: Function | boolean, delay = 500, bypass?: boolean) {
	if (bypass) return
	clearTimers()
	overTimer = setTimeout(() => {
		run(cb)
	}, delay)
}

/**
 * Debounced hover event
 * @param cb Callback to run, or boolean to make false
 * @param delay delay in ms
 * @param bypass optionally cancel the debounce
 */
let outTimer: NodeJS.Timeout
function smoothOut(cb: Function, delay = 300) {
	clearTimers()
	outTimer = setTimeout(() => {
		run(cb)
	}, delay)
}

export const smoothHover = {
	smoothOver,
	smoothOut
}
