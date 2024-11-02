import type { CSSColorName } from './css-colors'

import { CSS_COLORS, randomCSSColorName } from './css-colors'
import { r, y, gr, dim, hex } from './l'
import { stringify } from './stringify'
import { defer } from './defer'
import { tldr } from './tldr'
import { DEV } from 'esm-env'

export interface LoggerOptions {
	/**
	 * Whether to use the styled logger or the regular console.log.
	 * @default true
	 */
	styled?: boolean
	/**
	 * Whether to defer the log to the next idle state.  Disabled on Safari to avoid crashing.
	 * @default true
	 */
	deferred?: boolean
	/**
	 * The foreground color of the log.
	 * @default randomColor()
	 */
	fg?: CSSColorName | (string & {})
	/**
	 * The background color of the log.
	 * @default transparent
	 */
	bg?: CSSColorName | (string & {})
	/**
	 * Any additional CSS to apply to the log.
	 * @default ''
	 */
	css?: string
	/**
	 * Run the logger on the server.
	 * @default false
	 */
	server?: boolean | 'dev'
	/**
	 * Run the logger in the browser.
	 * @default 'dev'
	 */
	browser?: boolean | 'dev'
	/**
	 * Print's the url of the file that called the logger.
	 */
	callsite?: boolean
	/**
	 * The title of the logger.  Prepended to all logs.
	 * @default ''
	 */
	title?: string
}

// todo - How can we ensure the logger is stripped _completely_ from production builds?
const ENABLED = true

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'off'

export class Logger {
	private static _BYPASS_STYLES = false
	private static _BYPASS_DEFER = true

	title = ''
	options: LoggerOptions
	color: (str: string) => string

	#logger: (...args: unknown[]) => void

	constructor(title: string, options?: LoggerOptions)
	constructor(options: LoggerOptions)
	constructor(titleOrOptions: string | LoggerOptions, options?: LoggerOptions) {
		if (typeof titleOrOptions === 'string') {
			this.title = titleOrOptions
			this.options = options ?? {}
		} else {
			this.options = titleOrOptions
			this.title = titleOrOptions.title ?? ''
		}

		const colorname = options?.fg?.toLowerCase() ?? randomCSSColorName()
		const fg = colorname in CSS_COLORS ? CSS_COLORS[colorname as CSSColorName] : colorname

		this.color = hex(fg)
		this.#logger = Logger.createLogger(this.title, this.options)

		return this
	}

	get deferred() {
		return !Logger._BYPASS_DEFER && this.options?.deferred
	}

	/**
	 * Logs any args as well as any logs in the current buffer.
	 * @param args
	 */
	log = (...args: unknown[]) => {
		this.#logger(...args)
	}

	/**
	 * Logs any args as well as any logs in the current buffer.
	 * @param args
	 */
	flush = (...args: unknown[]) => {
		if (this.buffer.length) {
			// @ts-expect-error ...
			if (args[0].match(/ⓘ|⚠|⛔|💀/)) {
				this.buffer.unshift(args.shift())
			}
			this.consolidateBuffer()
			this.#logger(...this.buffer, ...args)
		} else {
			this.#logger(...args)
		}

		this.buffer = []
	}

	i = hex('#426685')('ⓘ')
	info(...args: unknown[]) {
		this.flush(this.i, ...args)
		return this
	}

	warn(...args: unknown[]) {
		this.flush(y('⚠'), ...args)
		return this
	}

	error(...args: unknown[]) {
		this.flush(r('⛔'), ...args)
		return this
	}

	debug(...args: unknown[]) {
		if (import.meta?.env?.VITE_FRACTILS_LOG_LEVEL === 'debug') this.flush('🐞', ...args)
		return this
	}

	buffer = [] as unknown[]

	/**
	 * Replaces any sequentially repeating strings in the buffer with a single instance and a count.
	 */
	consolidateBuffer() {
		const buff = new Map<string, number>()

		for (const item of this.buffer) {
			// @ts-expect-error ...
			buff.set(item, (buff.get(item) ?? 0) + 1)
		}

		this.buffer = Array.from(buff).map(([item, count]) =>
			count > 1 ? `${item}x${dim(`${count}`)}` : item,
		)
	}

	/**
	 * Used to display the name of a method being called and the arguments it's being called with.
	 * @param str The name of the method being called.
	 * @param args The arguments being passed to the method.
	 * @returns The logger instance.
	 *
	 * @example
	 * ```typescript
	 * const log = new Logger('Foo')
	 * const bar = (a: number) => log.fn('bar', a)
	 * bar(1) // logs:
	 * ⓘ Foo bar(1)
	 * ```
	 */
	fn(str: string, ...args: unknown[]) {
		this.buffer.push(
			gr(str) +
				gr('(') +
				args.map((a) => gr(typeof a === 'object' ? stringify(a) : String(a))).join(', ') +
				gr(')'),
		)
		Promise.resolve().then(() => (this.buffer = []))
		return this
	}

	static createLogger(title: string, options?: LoggerOptions) {
		if (!ENABLED) return () => void 0
		if (options?.browser === 'dev' && !DEV) return () => void 0

		options ??= {}

		const BROWSER = typeof globalThis.window !== 'undefined'
		const SERVER = !BROWSER

		if (!BROWSER || options.browser === false) return () => void 0
		if (SERVER && options.server !== true) return () => void 0

		const fg = options.fg || randomCSSColorName()
		const bg = options.bg || 'transparent'
		const css = options.css ?? ''

		options.styled ??= true
		const styled = options.styled && !Logger._BYPASS_STYLES

		options.deferred ??= true
		const deferred =
			options.deferred &&
			!Logger._BYPASS_DEFER &&
			// requestIdleCallback makes Safari explode
			/^((?!chrome|android).)*safari/i.test(navigator.userAgent)

		let messageConfigBase = '%c%s%c'

		// This is my shameful attempt to dim trailing title
		// parts and separate the rest onto a newline.
		const [t, ...rest] = title.split(' ')
		const restParts = [] as string[]
		if (rest.length) {
			for (const part of rest) {
				restParts.push(
					`color:#666;background:${bg};padding:0.1rem;filter:saturate(0.25);${css}`,
					` ${part}`,
				)
			}
			const i = restParts.indexOf(restParts.at(-1) ?? '')
			if (i >= 0) {
				restParts[i] = `${restParts[i]}\n`
			}
			messageConfigBase = '%c%s'.repeat(rest.length) + `${messageConfigBase}`
			title = t
		} else {
			title = `${title}\n`
		}

		const log = !styled
			? (...args: unknown[]) => {
					console.log(`| ${title} |`, ...args)
				}
			: (...args: unknown[]) => {
					let messageConfig = messageConfigBase

					args.forEach((argument) => {
						const type = typeof argument
						switch (type) {
							case 'bigint':
							case 'number':
								messageConfig += '%d '
								break

							case 'string':
								messageConfig += '%s '
								break

							case 'object':
							case 'boolean':
							case 'undefined':
							default:
								messageConfig += '%o '
						}
					})

					console.log(
						// messageConfig + '%c%s',
						messageConfig + '%c',
						`color:${fg};background:${bg};padding:0.1rem;${css}`,
						`${title}`,
						...restParts,
						`color:initial;background:${bg};padding:0.1rem;${css}`,
						...args.map((a) =>
							// Testing console goes nuts with large objects, so we tldr them.
							import.meta?.env?.VITEST ? tldr(a, { maxDepth: 1, maxSiblings: 1 }) : a,
						),
						`color:#666;background:${bg};padding:0.1rem;${css};font-size:0.66rem;`,
					)
				}

		if (!deferred) return log

		return (...args: unknown[]) => defer(() => log(...args))
	}
}

export const logger = (title = 'LOG', options?: LoggerOptions) => {
	return Logger.createLogger(title, options)
}
