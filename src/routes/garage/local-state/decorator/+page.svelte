<script lang="ts">
	import { untrack } from 'svelte'

	let ls = $state({})
	function initPersistentState<T>(key: string, defaultValue: T) {
		const stored = localStorage.getItem(`${key}`)
		return stored ? JSON.parse(stored) : defaultValue
	}

	class Settings {
		foo = $state(initPersistentState('foo', 'bar'))

		constructor() {
			$effect(() => {
				localStorage.setItem('settings', JSON.stringify(this.toJSON()))
				untrack(() => {
					setTimeout(() => {
						ls = JSON.parse(localStorage.getItem('settings') ?? '{}')
					}, 100)
				})
			})
		}

		toJSON() {
			return $state.snapshot(this)
		}
	}

	const settings = new Settings()
</script>

<input bind:value={settings.foo} type="text" />

<!-- <pre>{JSON.stringify(settings, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(ls, null, 2)}</pre> -->
