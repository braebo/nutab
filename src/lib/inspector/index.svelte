<script lang="ts">
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import { folderEditor } from '$lib/stores/folderEditor.svelte'
	import { settings, cMenu } from '$lib/stores/settings.svelte'
	import { blurOverlay } from '$lib/stores/blurOverlay.svelte'
	import { grid } from '$lib/stores/grid.svelte'
	import Inspector from './Inspector.svelte'
	import { db } from '$lib/data/db.svelte'
	import { onMount } from 'svelte'

	let mounted = false
	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 100))
		mounted = true
	})
</script>

{#if mounted}
	<Inspector
		register={{
			uniqueTags: db.uniqueTags,
			activeBookmarks: db.activeBookmarks,
			activeFolder: db.activeFolder,
			tagFilter: db.tagFilter,
			cMenu,
			settings,
			grid: {
				dimensions: grid.dimensions,
				width: grid.width,
				iconSize: grid.iconSize,
				gap: grid.gap,
			},
			bookmarkEditor: {
				blurOverlay,
				editorType: bookmarkEditor.editorType,
				editorShown: bookmarkEditor.editorShown,
				showBookmarkEditor: bookmarkEditor.showBookmarkEditor,
				showFolderEditor: bookmarkEditor.showFolderEditor,
			},
			folderEditor: folderEditor,
		}}
	/>
{/if}
