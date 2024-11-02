<script lang="ts">
	import { LocalStorage } from '$lib/utils/localState.svelte'
	import { untrack } from 'svelte'

	localStorage.clear()

	const settings = new LocalStorage('settings', {
		foo: 'bar',
	})

	let storage = $state({})
	$effect(() => {
		settings.value.foo
		untrack(() => {
			setTimeout(() => {
				storage = JSON.parse(localStorage.getItem('settings') ?? '{}')
			}, 100)
		})
	})
</script>

<div style="height: 5rem;"></div>

<section>
	<h4>foo {settings.value.foo}</h4>
	{#if settings.value}
		<input bind:value={settings.value.foo} type="text" />
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
