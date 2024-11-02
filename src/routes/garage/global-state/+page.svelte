<script lang="ts">
	import { globals } from './globals.svelte'
</script>

<div style="height: 5rem;"></div>

<section>
	<button onclick={() => globals.cart.push('test')}>PUSH</button>
	<button onclick={() => globals.cart.pop()}>POP</button>
</section>

<section>
	<h4>{globals.cart}</h4>
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

	button {
		width: 5rem;
	}
</style>
