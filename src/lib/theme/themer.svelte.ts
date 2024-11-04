import { safeLocalStorage } from '$lib/utils/safeLocalStorage'
import { parse } from 'cookie'

export type Theme = 'dark' | 'light'
export type Preference = 'dark' | 'light' | 'system'

/**
 * Options for the {@link Themer} class.
 */
interface ThemerOptions {
	/**
	 * A default fallback for when local/cookie storage are unset/disabled.
	 * @default 'dark'
	 */
	defaultMode: 'light' | 'dark' | 'system'
	/**
	 * The key to use in local/cookie storage.  If `false`, storage will be
	 * disabled.
	 * @default 'theme-mode'
	 */
	storage: string | false
}

/**
 * A theme manager that handles theme preferences and system changes.
 */
class Themer {
	/**
	 * The users current theme preference.  Defaults to `system`.
	 */
	preference = $state<'light' | 'dark' | 'system'>('system')
	/**
	 * Whether storage is enabled for the theme preference.
	 */
	#storage: boolean
	/**
	 * Whether `init` has been called at least once.
	 */
	#initialized = false
	/**
	 * The key to use in local/cookie storage.
	 */
	#storageKey = 'theme-mode'
	/**
	 * Used for OS-level preference change events.
	 */
	#prefersLight?: MediaQueryList

	constructor(options?: ThemerOptions) {
		this.#storage = options?.storage !== false

		this.preference = this.#resolveStorage(options?.defaultMode ?? 'dark')

		if (globalThis.window) {
			this.init()
		}

		this.dispose = $effect.root(() => {
			$effect(() => {
				this.applyTheme()
			})
		})
	}

	/**
	 * The current theme mode `light` or `dark`.
	 */
	get mode() {
		return this.#resolveMode()
	}
	set mode(m: 'light' | 'dark') {
		this.preference = m
	}

	/**
	 * Toggles between `light` and `dark` mode.
	 */
	toggle() {
		this.preference = this.mode === 'light' ? 'dark' : 'light'
	}

	/**
	 * Runs once automatically if the `window` object is available, but can be called manually if
	 * needed without consequence.
	 */
	init() {
		if (this.#initialized) return
		this.#initialized = true

		this.#prefersLight = globalThis.window.matchMedia('(prefers-color-scheme: light)')

		this.#prefersLight.removeEventListener('change', this.#onSystemChange)
		this.#prefersLight.addEventListener('change', this.#onSystemChange)

		globalThis.window.removeEventListener('storage', this.#onStorageChange)
		globalThis.window.addEventListener('storage', this.#onStorageChange)
	}

	/**
	 * Applies the active theme variables to the themer's adopted style sheet, and sets the root
	 * `color-scheme` style property to the current mode.  This method is called automatically
	 * whenever the theme or mode changes.
	 */
	applyTheme = () => {
		document.documentElement.style.setProperty('color-scheme', this.mode)
		document.documentElement.setAttribute('theme', this.mode)
		document.documentElement.setAttribute('color-scheme', this.mode)

		if (this.#storage) {
			if (Themer.#isPref(this.preference)) {
				safeLocalStorage.set(this.#storageKey, this.preference)
			}

			if (typeof globalThis.document !== 'undefined') {
				document.cookie = `${this.#storageKey}=${this.#resolveMode(this.preference)}; path=/;`
			}
		}
	}

	/**
	 * Resolves a light-dark CSS function based on the current theme mode.
	 * @param value The light-dark CSS function as a string
	 * @returns The resolved value based on the current mode
	 */
	resolveLightDark(value: string): string {
		const lightDarkRegex = /light-dark\((.*?),(.*?)\)/
		const match = value.match(lightDarkRegex)

		if (match) {
			const [, lightValue, darkValue] = match
			return this.mode === 'light' ? lightValue.trim() : darkValue.trim()
		}

		return value // Return the original value if it's not a light-dark function
	}

	/**
	 * Retrieves the preference from local/cookie storage, falling back to the
	 * provided default if storage is disabled, unavailable, or unset.
	 */
	#resolveStorage(fallback: Preference): Preference {
		if (!this.#storage || !globalThis.localStorage) return fallback
		try {
			const localPref = safeLocalStorage.get(this.#storageKey, fallback)
			if (Themer.#isPref(localPref)) return localPref

			const cookiePref = parse(globalThis.document?.cookie)[this.#storageKey]
			if (Themer.#isPref(cookiePref)) return cookiePref
		} catch (e) {
			console.error(e)
			return fallback
		}

		return fallback
	}

	#resolveMode(preference = this.preference): 'light' | 'dark' {
		return preference === 'system'
			? this.#prefersLight?.matches
				? 'light'
				: 'dark'
			: preference
	}

	#onSystemChange = () => {
		this.preference = 'system'
	}

	#onStorageChange = (e: StorageEvent) => {
		if (e.key === this.#storageKey) {
			this.preference = e.newValue as Preference
		}
	}

	static #isPref(thing: unknown): thing is Preference {
		return ['light', 'dark', 'system'].includes(thing as Preference)
	}

	dispose: () => void
}

/**
 * A document-wide theme manager.
 */
export const themer = new Themer()
