<script lang="ts">
	// Types
	import type { Folder } from '$lib/data/types'

	// Data
	import { editor, folderEditor, editorShown } from '$lib/stores/bookmarkEditor'
	import { showSettings } from '$lib/data/settings/settingsStore'
	import { getFolder_db } from '$lib/data/transactions'

	// Utils
	import { idFromClassList } from '$lib/utils'
	import { clickOutside } from 'fractils'
	import { fly } from 'svelte/transition'

	export let options = [
		{
			text: 'New Bookmark',
			action: () => editor.show(['create', 'bookmark'])
		},
		{
			text: 'Settings',
			action: () => ($showSettings = true)
		}
	]

	let showMenu = false
	let x: number, y: number

	async function show(e: MouseEvent) {
		if ($editorShown) return
		const target = e.target as Element

		// if mouse target is bookmark, show it's settings.
		const i = idFromClassList(target.classList, 'cell-')
		if (i !== null) return await editor.show(['edit', 'bookmark'], i)

		// if mouse target is folder, show it's settings.
		if (target.classList.contains('_folder_')) {
			$folderEditor = await getFolder_db(target.id as Folder['folder_id'])
			await editor.show(['edit', 'folder'])
			return
		}

		// else show context menu.
		x = e.clientX
		y = e.clientY
		showMenu = true
	}

	function handleAction(e: MouseEvent, i: number) {
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
		{#each options as { text }, i}
			<div class="option" on:click={(e) => handleAction(e, i)}>
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

		z-index: 20;
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
