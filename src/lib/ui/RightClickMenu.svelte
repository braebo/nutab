<script lang="ts">
	import { showSettings } from '$lib/data/settings/settingsStore'
	import { createEventDispatcher } from 'svelte'
	import { fly } from 'svelte/transition'
	import { clickOutside } from 'fractils'
	const dispatch = createEventDispatcher()

	export let options = [
		{
			text: 'New Bookmark',
			action: () => dispatch('newBookmark')
		},
		{
			text: 'Settings',
			action: () => ($showSettings = true)
		}
	]

	let showMenu = false
	let x: number, y: number

	function show(e: MouseEvent) {
		// if target is bookmark, show it's settings.
		const target = e.target as Element
		if (target.className.includes('cell')) {
			const classes = target.classList
			let i: number
			classes.forEach((c) => {
				if (c.includes('cell-') && c.length > 3) {
					i = parseInt(c.split('cell-')[1])
				}
			})
			dispatch('showEditor', { i })
			// else show context menu
		} else {
			x = e.clientX
			y = e.clientY
			showMenu = true
		}
	}

	function handleAction(i: number) {
		options[i].action()
		showMenu = false
	}
</script>

<svelte:window on:contextmenu|preventDefault={(e) => show(e)} />

{#if showMenu}
	<div
		class="menu"
		style="left: {x}px;top: {y}px;"
		use:clickOutside={() => (showMenu = false)}
		in:fly={{ y: 5, duration: 250 }}
		out:fly={{ y: 5, duration: 150 }}
	>
		{#each options as { text, action }, i}
			<div class="option" on:click={() => handleAction(i)}>
				{text}
			</div>
		{/each}
	</div>
{/if}

<style>
	.menu {
		position: absolute;

		width: max-content;
		height: max-content;
		margin: auto;

		border-radius: 0.5em;
		background: var(--light-a);
		color: var(--dark-c);
		box-shadow: 1px 2px 5px #00000022;

		overflow: hidden;
	}
	.option {
		padding: 0.5em 1.5em;

		border-bottom: 1px solid #00000011;

		cursor: pointer;

		transition: background 0.2s;
	}
	.option:hover {
		background: var(--light-b);
		color: var(--dark-a);
	}
</style>
