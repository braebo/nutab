import { safeLocalStorage } from '$lib/utils/safeLocalStorage'
import { untrack } from 'svelte'

class SearchState {
	activeEngine = $state<number>()
	searchValue = $state<string>()

	constructor() {
		this.dispose = $effect.root(() => {
			let first = true
			$effect(() => {
				this.activeEngine
				this.searchValue

				if (first) {
					first = false
					untrack(() => {
						this.activeEngine = safeLocalStorage.get('search-activeEngine', 0)
						this.searchValue = safeLocalStorage.get('search-searchValue', '')
					})
				} else {
					safeLocalStorage.set('search-activeEngine', this.activeEngine)
					safeLocalStorage.set('search-searchValue', this.searchValue)
				}
			})
		})
	}
	dispose: () => void
}

export const search_state = new SearchState()
