<script>
	import { fly } from 'svelte/transition'
	import { backIn, backOut } from 'svelte/easing'
	import { quintIn } from 'svelte/easing'
</script>

<div id="logo">
	<span
		id="NU"
		class="logo-text"
		tabindex="-1"
		in:fly={{ y: 10, duration: 1000, delay: 420, easing: backOut }}
		out:fly={{ y: -10, duration: 1000, delay: 420, easing: quintIn }}
	>
		NU
	</span>

	<span
		id="TAB"
		class="logo-text"
		in:fly={{ y: -10, duration: 1000, delay: 420, easing: backOut }}
		out:fly={{ y: 10, duration: 1000, delay: 420, easing: quintIn }}
	>
		TAB
	</span>
</div>

<style>
	#logo {
		display: flex;
		justify-content: space-around;

		margin: auto;

		opacity: 0.75;

		user-select: none;
		pointer-events: none;

		transform: translateX(-7px);
	}

	.logo-text {
		padding: 0 5px 0 8px;

		font-size: clamp(30px, 1vw, 100px);

		user-select: none;
		z-index: 10;
	}

	#NU {
		color: var(--brand-a);
	}

	#TAB {
		color: var(--dark-a);
	}
</style>
