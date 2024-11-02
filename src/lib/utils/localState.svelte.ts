import { Logger } from './logger'
import { untrack } from 'svelte'

/**
 * The class that {@link persist} wraps.
 */
export class LocalStorage<T> {
	#value = $state<T>()
	// #disposed = false
	#log: Logger

	get value(): T {
		return this.#value ?? this.#get()
	}
	set value(v: T) {
		this.#set(v)
		this.#value = v
	}

	constructor(
		/**
		 * The key to use in localStorage.
		 */
		public key: string,
		/**
		 * The initial value to use if the key is not found in localStorage.
		 */
		public initialValue: T,
	) {
		this.#log = new Logger('LocalState ' + this.key, { fg: '#BC8F8F' })
		this.#value = this.#get()
		// this.current = initialValue

		$effect(() => {
			untrack(() => {
				// this.#refresh()
				window.removeEventListener('storage', this.#handleStorageEvent)
				window.addEventListener('storage', this.#handleStorageEvent)

				return () => window.removeEventListener('storage', this.#handleStorageEvent)
			})
		})

		$effect(() => {
			this.value ??= this.#get()
			this.#set(this.value)
			untrack(() => {
				console.log(
					'LocalState() - 🔵 setting initialValue',
					$state.snapshot({ key, value: this.value }),
				)
			})
		})

		// $inspect('LocalState()', { key, initialValue, 'this.current': this.current })
	}

	update(callback: (value: $state.Snapshot<T>) => T) {
		this.value = callback($state.snapshot(this.value))
	}

	// /**
	//  * A convenience method to react to changes in this instance's {@link value}.
	//  */
	// subscribe(callback: (value: T) => void): void {
	// 	$effect(() => {
	// 		this.current
	// 		if (this.current) callback(this.value)
	// 	})
	// }

	// dispose = () => {
	// 	this.#log.info('dispose(🚫)')
	// 	// this.#disposed = true
	// 	window.removeEventListener('storage', this.#handleStorageEvent)
	// }

	#refresh() {
		this.#log.info('refresh()', { key: this.key, initialValue: this.initialValue })
		const v = this.#get()
		if (v === this.initialValue) return
		this.value = v
	}

	#handleStorageEvent = (e: StorageEvent) => {
		if (e.key === this.key) {
			this.#refresh()
		}
	}

	/**
	 * A safe localStorage.getItem that handles all of the edge-cases around serialization.
	 */
	#get(): T {
		try {
			const storage = localStorage.getItem(this.key)
			if (storage !== null) {
				try {
					// Attempt to parse as JSON
					return JSON.parse(storage) as T
				} catch {
					// Parsing fails on naked strings.
					if (typeof this.initialValue === 'string') {
						return storage as T // Safe to cast here as we know initialValue is a string
					}
					console.warn(
						`Stored value for ${this.key} is a string, but initialValue is not. Using initialValue.`,
					)
				}
			}
		} catch (e) {
			console.error(`Error getting ${this.key} from localStorage`, {
				key: this.key,
				initialValue: this.initialValue,
				error: e,
			})
		}

		return this.initialValue
	}

	/**
	 * A safe localStorage.setItem that handles all of the edge-cases around de-serialization.
	 */
	#set(value: T): void {
		if (typeof value === 'undefined') return
		this.#log.info('set()', { key: this.key, value })

		let stringValue: string

		if (typeof value === 'string') {
			// Check if the string is already a valid JSON
			try {
				JSON.parse(value)
				stringValue = value // It's already a valid JSON string
			} catch {
				stringValue = JSON.stringify(value) // It's a regular string, stringify it
			}
		} else {
			stringValue = JSON.stringify(value)
		}

		if (stringValue === '""' || stringValue === '') {
			return
		}

		try {
			localStorage.setItem(this.key, stringValue)
		} catch (e) {
			console.error(`Error setting ${this.key} in localStorage`, {
				key: this.key,
				value,
				stringValue,
				error: e,
			})
		}
	}
}
