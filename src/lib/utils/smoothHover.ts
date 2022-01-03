let overTimer: NodeJS.Timeout
export function smoothOver(fn: Function, delay = 500, bypass?: boolean) {
	if (bypass) return
	clearTimeout(overTimer)
	overTimer = setTimeout(() => {
		fn()
	}, delay)
}

let outTimer: NodeJS.Timeout
export function smoothOut(fn: Function, delay = 300) {
	clearTimeout(outTimer)
	outTimer = setTimeout(() => {
		fn()
	}, delay)
}
