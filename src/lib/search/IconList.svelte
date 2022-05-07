<script lang="ts">
	import type { Engine } from '$lib/data/types'
	import { createEventDispatcher } from 'svelte'
	import { fly } from 'svelte/transition'

	export let engines: Engine[] = []
	export let searchFocused = true

	let hovering = Array(engines.length).fill(false)
	let disableShowAll = false
	let hoverTarget = 0
	let showAll = false
	let timer: NodeJS.Timeout

	$: hovering

	const mouseover = (i: number) => {
		if (disableShowAll) return
		timer && clearTimeout(timer)

		hovering.fill(false)
		hovering[i] = true
		hoverTarget = i
		showAll = true
	}

	const mouseout = (i: number) => {
		timer && clearTimeout(timer)
		timer = setTimeout(() => {
			hovering[i] = false
			hoverTarget = 0
			showAll = false
		}, 400)
	}

	const dispatch = createEventDispatcher()
	const handleClick = (i: number) => {
		dispatch('newSelection', { position: i })

		disableShowAll = true
		showAll = false
		hoverTarget = 0

		setTimeout(() => {
			disableShowAll = false
		}, 250)
	}

	const isActiveEngine = (i: number) => i === 0
</script>

<div class="engines">
	{#each engines as { position, icon }, i}
		{#if isActiveEngine(i) || showAll}
			<div
				class="icon"
				class:hovering={hovering[i] || searchFocused}
				style="transform: translateX(-{i * 50}px);"
				in:fly={{ x: 10 * i }}
				out:fly={{ x: 10 * i, duration: 300 - 50 * i }}
				on:mouseover={() => mouseover(i)}
				on:focus={() => mouseover(i)}
				on:mouseout={() => mouseout(i)}
				on:blur={() => mouseout(i)}
				on:click={() => handleClick(position)}
			>
				<svelte:component this={icon} />
			</div>
		{/if}
	{/each}

	{#key hoverTarget}
		<div
			in:fly={{ delay: 50, y: 4 }}
			out:fly={{ duration: 150, y: -4 }}
			class="tooltipText"
			class:bright={hovering[hoverTarget]}
		>
			{engines[hoverTarget]?.name}
		</div>
	{/key}
</div>

<style>
	.engines {
		position: relative;
		display: flex;
		align-items: center;
		flex-grow: 0.35;

		height: 2rem;
		min-width: max-content;
		margin: auto;

		transform: translate(3.25rem);
		cursor: pointer;
		z-index: 2;
	}

	.icon {
		position: absolute;
		display: flex;

		width: 2rem;

		opacity: 0.5;

		transition: 0.25s;
	}

	.icon.hovering {
		opacity: 1;

		filter: none;
	}

	.tooltipText.bright {
		opacity: 1;

		transition-delay: opacity 1.5s, transform 0.2s;
	}

	.tooltipText {
		position: absolute;

		text-align: center;
		white-space: nowrap;
		letter-spacing: 0.3em;
		font-family: var(--font-a);

		opacity: 0;
		color: var(--dark-d) !important;

		transform: translate(7px, 50px);
		transition: 0.2s ease-out;
		transition-delay: opacity 0.5s, transform 0.2s;
	}
</style>
