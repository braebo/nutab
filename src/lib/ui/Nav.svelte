<script lang="ts">
	import { onMount } from 'svelte'
	import NuTab from './NuTab.svelte'

	let visible = false
	onMount(() => {
		visible = true
		setTimeout(() => {
			visible = false
		}, 1000)
	})
</script>

<nav>
	{#if visible}
		<div class="logo">
			<NuTab />
		</div>
	{/if}
</nav>

<style>
	nav {
		display: flex;
		justify-content: center;
		position: fixed;
		width: 100%;
		padding: 1rem;
		font-size: 30px;
	}

	.logo {
		position: absolute;
		inset: 0;
		width: max-content;
		margin: 2rem auto;
	}
</style>
