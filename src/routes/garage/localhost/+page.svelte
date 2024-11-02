<script lang="ts">
	import { onMount } from 'svelte'

	let port = $state('5173')
	let running = $state(false)
	let data = $state(null)
	let timeout: ReturnType<typeof setTimeout>

	onMount(() => {
		ping()

		return () => clearTimeout(timeout)
	})

	$effect(() => {
		timeout = setTimeout(() => ping(), 10000)

		return () => clearTimeout(timeout)
	})

	async function ping() {
		try {
			const res = await fetch('http://localhost:' + port, { method: 'HEAD' })
			running = res.ok
		} catch (e) {
			running = false
		}
	}
</script>

<section>
	<div>
		<label for="port"> Port </label>
		<input name="port" bind:value={port} />
	</div>
	{#if running}
		<h1 style:color="lightgreen">Running</h1>
	{:else}
		<h1 style:color="lightcoral">Not Running</h1>
	{/if}

	<pre>{data}</pre>
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		max-width: 500px;
		margin: 10rem auto;

		background: #11112250;
		outline: 1px solid var(--fg-a);

		overflow: scroll;
	}
</style>
