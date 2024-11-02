<script lang="ts">
	import { LocalStorage } from '$lib/utils/localState.svelte'
	import { safeLocalStorage } from '$lib/utils/safeLocalStorage'
	import { untrack } from 'svelte'

	const count = new LocalStorage('garage-count', 1)

	let calls = $state(0)
	let localStorage = $state({})
	$effect(() => {
		count.value
		untrack(() => {
			calls++
			setTimeout(() => {
				localStorage = {
					count: safeLocalStorage.get('garage-count', 'error'),
				}
			}, 100)
		})
	})
</script>

<div style="height: 5rem;"></div>

<section>
	<h4>calls {calls}</h4>
</section>

<section>
	<h4>count {count.value}</h4>
	<input bind:value={count.value} type="number" />
</section>

<section>
	<h4>localStorage</h4>
	<pre>{JSON.stringify(localStorage, null, 2)}</pre>
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
