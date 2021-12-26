<script>
	import { fly } from 'svelte/transition'
	import { onMount } from 'svelte'

	let mounted = false
	onMount(() => {
		mounted = true
	})
</script>

<div id="logo">
	<span
		id="NU"
		class="logo-text"
		style="color: var(--brand-a);"
		tabindex="-1"
		in:fly={{ y: 10, duration: 1000, delay: 420 }}
	>
		NU
	</span>

	<span id="TAB" class="logo-text" in:fly={{ y: -10, duration: 1000, delay: 420 }}>TAB</span>
</div>

<style>
	#logo {
		display: flex;
		justify-content: space-around;

		margin: auto;

		opacity: 0.75;

		user-select: none;
		pointer-events: none;
	}

	.logo-text {
		padding: 0 5px 0 8px;

		font-size: clamp(30px, 1vw, 100px);

		z-index: 10;
	}

	#NU {
		user-select: none;
	}
</style>
