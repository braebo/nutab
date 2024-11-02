export const safeLocalStorage = {
	get: <T>(key: string, fallback: T): T => {
		if (!globalThis.localStorage) return fallback

		try {
			const raw = localStorage.getItem(key)
			if (!raw) return fallback

			if (typeof fallback === 'string') {
				return raw as T
			} else {
				return JSON.parse(raw) as T
			}
		} catch (e) {
			console.error(`Error getting ${key} from localStorage`, {
				key,
				fallback,
				error: e,
			})
			return fallback
		}
	},

	set: <T>(key: string, value: T): void => {
		if (!globalThis.localStorage) return

		try {
			const serialized = typeof value === 'string' ? value : JSON.stringify(value)
			localStorage.setItem(key, serialized)
		} catch (e) {
			console.error(`Error setting ${key} in localStorage`, {
				key,
				value,
				error: e,
			})
		}
	},
}
