import { DEV } from 'esm-env'

class Device {
	/**
	 * Mobile breakpoint in pixels.
	 * @default 1000
	 */
	public breakpoint = $state(1000)
	/**
	 * `window.innerWidth`
	 */
	public width = $state(100)
	/**
	 * `window.innerHeight`
	 */
	public height = $state(100)
	/**
	 * true if `window.innerWidth` < {@link breakpoint|`breakpoint`}
	 */
	public mobile = $derived.by(() => this.width < this.breakpoint)
	/**
	 * `window.scrollY`
	 */
	public scrollY = $state(0)
	/**
	 * Client coordinates of the mouse or touch point.
	 */
	public mouse = $state({ x: 0, y: 0 })

	/**
	 * Reactive window / pointer wrapper.
	 */
	constructor(
		/**
		 * Mobile breakpoint in pixels.
		 * @default 1000
		 */
		breakpoint?: number,
	) {
		if (breakpoint) this.breakpoint = breakpoint
		this.#listen(
			$effect.root(() => {
				$effect(() => {
					this.#init()
					$inspect('Device', this)
				})
			}),
		)
	}

	#init() {
		if (!globalThis.window) {
			if (DEV) console.warn('device.svelte - server detected; Window object unavailable')
			return
		}

		this.#onResize()
		this.#onScroll()

		this.#listen(this.#onResize, 'resize')
		this.#listen(this.#onScroll, 'scroll')
		this.#listen(this.#onPointerMove as EventCallback, 'pointermove', { passive: true })
	}

	#onResize = (): void => {
		this.width = globalThis.window.innerWidth || 0
		this.height = globalThis.window.innerHeight || 0
	}

	#onScroll = (): void => {
		this.scrollY = globalThis.window.scrollY || 0
	}

	#frame = 0
	#onPointerMove = (e?: PointerEvent): void => {
		cancelAnimationFrame(this.#frame)
		this.#frame = requestAnimationFrame(() => {
			this.mouse.x = e?.clientX || 1
			this.mouse.y = e?.clientY || 1
		})
	}

	#onDispose = new Set<EventCallback>()
	#listen(callback: EventCallback, name?: string, opts?: AddEventListenerOptions): void {
		if (name) {
			addEventListener(name, callback, opts)
			this.#onDispose.add(() => removeEventListener(name, callback, opts))
		} else {
			this.#onDispose.add(callback)
		}
	}

	/**
	 * Cleans up event listeners.
	 */
	public dispose() {
		removeEventListener('resize', this.#onResize)
		removeEventListener('scroll', this.#onScroll)
		removeEventListener('pointermove', this.#onPointerMove)
		for (const cleanup of this.#onDispose) {
			cleanup()
		}
	}
}

/**
 * Reactive window / pointer wrapper with a dispose method.
 *
 * Includes:
 * - breakpoint
 * - width
 * - height
 * - mobile
 * - scrollY
 * - mouse
 */
export const device = new Device()

type EventCallback = (e?: Event | PointerEvent) => void
