class Themer {
	/** @type {'light' | 'dark' | 'system'} */
	// @ts-expect-error - no clue how to non-null assert in jsdoc
	preference = $state()

	/** @type {MediaQueryList | undefined} */
	#prefersLight

	theme = $derived.by(() => {
		return this.preference === 'system'
			? this.#prefersLight?.matches
				? 'light'
				: 'dark'
			: this.preference
	})

	constructor() {
		// rune hoopla
		$effect.root(() => {
			$effect(() => {
				this.#prefersLight ??= globalThis.window?.matchMedia(
					'(prefers-color-scheme: light)',
				)

				if (!this.preference) {
					// @ts-expect-error - no clue how to cast in jsdoc
					this.preference = localStorage.getItem('theme-preference') ?? 'system'
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
