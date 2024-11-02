<script module lang="ts">
	// Only works with objects...
	export function createLocalStorage<T extends object>(key: string, initialValue: T) {
		const stored = localStorage.getItem(key)
		let value = stored ? JSON.parse(stored) : initialValue
		const _state = $state(value) // Won't work - runes are compile-time only

		$effect(() => {
			localStorage.setItem(key, JSON.stringify($state.snapshot(_state)))
		})

		return _state
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte'

	localStorage.clear()

	const settings = createLocalStorage('settings', {
		foo: 'bar',
	})

	let storage = $state({})
	$effect(() => {
		settings?.foo
		untrack(() => {
			setTimeout(() => {
				storage = JSON.parse(localStorage.getItem('settings') ?? '{}')
			}, 100)
		})
	})
</script>

<div style="height: 5rem;"></div>

<section>
	<h4>foo {settings?.foo}</h4>
	{#if settings}
		<input bind:value={settings.foo} type="text" />
	{/if}
</section>

<section>
	<h4>localStorage</h4>
	<pre>{JSON.stringify(storage, null, 2)}</pre>
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		max-width: 300px;
		margin: 1rem auto;
		padding: 1rem;

		background: #11112250;
		outline: 1px solid var(--fg-a);

		overflow: scroll;
	}
</style>
