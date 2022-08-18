<script lang="ts">
	// Types
	import type { Folder } from '$lib/data/types'

	// Data
	import { folderEditor, editorShown } from '$lib/stores'
	import { getFolder_db } from '$lib/data/transactions'
	import { editor } from '$lib/stores/bookmarkEditor'
	import { cMenu, showSettings } from '$lib/stores'

	// Utils
	import { clickOutside, wait } from 'fractils'
	import { idFromClassList } from '$lib/utils'
	import { fly } from 'svelte/transition'

	export let options = [
		{
			text: 'New Bookmark',
			action: () => editor.show(['create', 'bookmark']),
		},
		{
			text: 'Settings',
			action: () => {
				$showSettings = true
			},
		},
	]

	async function show(e: MouseEvent) {
		if ($editorShown) return

		// Disable on news page
		for (const el of e.composedPath()) {
			if ((el as Element).classList?.contains('news')) return
			else if ((el as Element).classList?.contains('bookmarks')) break
		}

		e.preventDefault()
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
		positionMenu(e)
		$cMenu.visible = true
	}

	function positionMenu(e?: MouseEvent) {
		if (e) {
			$cMenu.x = e.clientX
			$cMenu.y = e.clientY
		}
	}

	function handleAction(e: MouseEvent, i: number) {
		options[i].action()
		$cMenu.visible = false
	}

	const handleClickOutside = async () => {
		$cMenu.visible = false
		$cMenu.pending = true
		await wait(100)
		$cMenu.pending = false
	}
</script>

<svelte:window on:contextmenu={(e) => show(e)} />

{#if $cMenu.visible}
	<div
		bind:this={$cMenu.el}
		class="cMenu"
		style="left: {$cMenu.x}px;top: {$cMenu.y}px;"
		use:clickOutside
		on:outclick={handleClickOutside}
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
	.cMenu {
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
		user-select: none;

		transition: background 0.2s;
	}
	.option:hover {
		background: var(--light-b);
		color: var(--dark-a);
	}
</style>
