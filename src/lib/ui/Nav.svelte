<script>
	import NuTab from './NuTab.svelte'
	import { onMount } from 'svelte'

	let mounted = false
	onMount(() => {
		mounted = true
	})
</script>

<nav>
	{#if mounted}
		<NuTab />
	{/if}
</nav>

<style>
	nav {
		display: flex;

		padding: 1rem;

		font-size: 30px;
	}
</style>
