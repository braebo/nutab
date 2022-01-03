let timer: NodeJS.Timeout

export function smoothOver(fn: Function, delay = 500, bypass?: boolean) {
	if (bypass) return
	timer && clearTimeout(timer)
	timer = setTimeout(() => {
		fn()
	}, delay)
}

export function smoothOut(fn: Function, delay = 300) {
	timer && clearTimeout(timer)
	timer = setTimeout(() => {
		fn()
	}, delay)
}
