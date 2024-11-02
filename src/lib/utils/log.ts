const isBrowser =
	typeof globalThis.window !== 'undefined' && typeof globalThis.window.document !== 'undefined'

const dev = () => {
	if (!isBrowser) return
	if (typeof process != 'undefined') {
		return process.env?.NODE_ENV === 'development'
	}
	try {
		return import.meta.env.DEV
	} catch (e) {
		console.error(e)
	}
	return false
}

/**
 * A simple logger that only runs in dev environments.
 * @param msg - A string or object to log
 * @param color - Any CSS color value ( named | hex | rgb | hsl )
 * @param bgColor - Same as color ⇧
 * @param fontSize - Any number
 * @param css - Optional additional CSS
 * @returns {void}
 */
export const log = (
	msg: string | unknown,
	color = 'lightblue',
	bgColor = 'transparent',
	fontSize = 15,
	css = '',
): void => {
	if (!dev) return

	if (typeof msg == 'string')
		return void console.log(
			`%c${msg}`,
			`padding:5px;color:${color};background: ${bgColor};border:1px solid ${color};size:${fontSize}px;${css}`,
		)

	console.log(msg)
}
