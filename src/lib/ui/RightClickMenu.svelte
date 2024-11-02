<script lang="ts">
	// Types
	import type { Folder } from '$lib/data/types'

	// Data
	import { exportBookmarks, importBookmarks } from '$lib/data/importExport'
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import { folderEditor } from '$lib/stores/folderEditor.svelte'
	import { cMenu, settings } from '$lib/stores/settings.svelte'
	import { getFolder_db } from '$lib/data/transactions.svelte'

	// Utils
	import { clickOutside } from '$lib/utils/clickOutside'
	import { idFromClassList } from '$lib/utils'
	import { fly } from 'svelte/transition'
	import { wait } from 'fractils'

	interface Props {
		options?: any
	}

	let {
		options = [
			{
				text: 'New Bookmark',
				action: () => bookmarkEditor.show(['create', 'bookmark']),
			},
			{
				text: 'Settings',
				action: () => {
					settings.showSettings = true
				},
			},
			{
				text: 'Download Bookmarks',
				action: async () => {
					await exportBookmarks()
				},
			},
			{
				text: 'Upload Bookmarks',
				action: async () => {
					await importBookmarks()
				},
			},
		],
	}: Props = $props()

	async function show(e: MouseEvent) {
		if (bookmarkEditor.editorShown) return

		// Disable on news page
		for (const el of e.composedPath()) {
			if ((el as Element).classList?.contains('news')) return
			else if ((el as Element).classList?.contains('bookmarks')) break
		}

		e.preventDefault()
		const target = e.target as Element

		// if mouse target is bookmark, show it's settings.
		const i = idFromClassList(target.classList, 'cell-')
		if (i !== null) return await bookmarkEditor.show(['edit', 'bookmark'], i)

		// if mouse target is folder, show it's settings.
		if (target.classList.contains('_folder_')) {
			folderEditor.editor = await getFolder_db(target.id as Folder['folder_id'])
			await bookmarkEditor.show(['edit', 'folder'])
			return
		}

		// else show context menu.
		positionMenu(e)
		cMenu.visible = true
	}

	function positionMenu(e?: MouseEvent) {
		if (e) {
			cMenu.x = e.clientX
			cMenu.y = e.clientY
		}
	}

	function handleAction(_e: MouseEvent, i: number) {
		options[i].action()
		cMenu.visible = false
	}

	const handleClickOutside = async () => {
		cMenu.visible = false
		cMenu.pending = true
		await wait(100)
		cMenu.pending = false
	}
</script>

<svelte:window oncontextmenu={(e) => show(e)} />

{#if cMenu.visible}
	<div
		bind:this={cMenu.el}
		class="cMenu"
		style="left: {cMenu.x}px;top: {cMenu.y}px;"
		use:clickOutside
		onoutclick={handleClickOutside}
		in:fly={{ y: 5, duration: 250 }}
		out:fly={{ y: 5, duration: 150 }}
	>
		{#each options as { text }, i}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div role="button" tabindex="0" class="option" onclick={(e) => handleAction(e, i)}>
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
		background: var(--fg-a);
		color: var(--bg-c);
		box-shadow: 1px 2px 5px #00000022;
		outline: 1px solid var(--fg-b);

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
		background: var(--fg-b);
		color: var(--bg-a);
	}
</style>
