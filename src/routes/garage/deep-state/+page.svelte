<script lang="ts">
	import { deepState } from './deep-state.svelte'
</script>

<div style="height: 5rem;"></div>

<section>
	<button onclick={() => (deepState.data.foo = 'oogly')}> deepState.data.foo = 'oogly' </button>

	<button onclick={() => (deepState.data.baz.qux = 'boogly')}>
		deepState.data.baz.qux = 'boogly'
	</button>
</section>

<section>
	<pre>{JSON.stringify(deepState, null, 2)}</pre>
</section>

<style lang="scss">
	:global(body) {
		background: #000;
	}

	section {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin: 1rem auto;

		overflow: scroll;
	}
</style>
