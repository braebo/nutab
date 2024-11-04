<script lang="ts">
	import { themer } from './simple-themer.svelte.js'

	let ls = $state({})
	$effect(() => {
		themer.theme
		themer.preference
		ls = {
			theme: localStorage.getItem('theme'),
			preference: localStorage.getItem('theme-preference'),
		}
	})
</script>

<main>
	<h2>theme = {themer.theme}</h2>
	<h2>preference = {themer.preference}</h2>

	<div class="buttons">
		<button on:click={() => (themer.preference = 'light')}>Light</button>
		<button on:click={() => (themer.preference = 'dark')}>Dark</button>
		<button on:click={() => (themer.preference = 'system')}>System</button>
	</div>

	<pre>localStorage: {JSON.stringify(ls, null, 2)}</pre>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;

		width: 30rem;
		margin: 5rem auto;
		padding: 3rem;

		background: black;
	}

	:global(:root[theme='light']) {
		background: white;
	}

	button {
		width: 7rem;
		margin: auto;

		color: black;
		background: lightblue;
		border-radius: 0.2rem;
	}
</style>
