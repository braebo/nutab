<script lang="ts">
	import { fly } from 'svelte/transition'

	export let label = ''
	export let i = 1
</script>

<div class="control" in:fly={{ y: 15, duration: 300, delay: 33 * i }} out:fly={{ y: 25, duration: 100 }}>
	<label for={label}>{label}</label>
	<div class="range">
		<slot />
	</div>
</div>

<style>
	.control {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;

		height: 3.5rem;
		width: var(--width);
		max-width: 100%;
		padding: 2px 15px;
		margin: auto;

		border: 1px solid rgba(var(--light-c-rgb), 0.33);
		background: rgba(var(--light-a-rgb), 0.25);
		border-radius: 10px;

		font-size: 16px;

		pointer-events: all;
	}

	label {
		position: relative;
		display: flex;
		align-items: center;

		color: var(--dark-d);

		/* width: max-content; */
		height: 100%;
		margin: auto 0;
	}

	.range {
		width: 85%;
		padding: 18px 0;
	}
</style>
