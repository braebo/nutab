export type ThemePreference = 'light' | 'dark' | 'system'

class Themer {
	preference = $state<ThemePreference>()

	#prefersLight: MediaQueryList | undefined

	theme = $derived.by(() => {
		return this.preference === 'system'
			? this.#prefersLight?.matches
				? 'light'
				: 'dark'
			: this.preference
	})!

	constructor() {
		$effect.root(() => {
			$effect(() => {
				this.#prefersLight ??= globalThis.window?.matchMedia(
					'(prefers-color-scheme: light)',
				)

				if (!this.preference) {
					this.preference = (localStorage.getItem('theme-preference') ??
						'system') as ThemePreference
				} else {
					localStorage.setItem('theme', this.preference)
				}

				localStorage.setItem('theme-preference', this.preference)
				localStorage.setItem('theme', this.theme)

				document.documentElement.setAttribute('theme', this.theme)
				document.documentElement.setAttribute('color-scheme', this.theme)

				$inspect('theme:', this.theme)
				$inspect('preference:', this.preference)
			})
		})
	}
}

export const themer = new Themer()
