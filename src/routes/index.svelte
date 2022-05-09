<script lang="ts">
	import { showBookmarkEditor, showFolderEditor } from '$lib/stores/bookmarkEditor'
	import { showSettings } from '$lib/data/settings/settingsStore'

	import BookmarkEditor from '$lib/ui/Bookmarks/BookmarkEditor.svelte'
	import FolderEditor from '$lib/ui/Folders/FolderEditor.svelte'
	import RightClickMenu from '$lib/ui/RightClickMenu.svelte'
	import Grid from '$lib/ui/Bookmarks/Grid.svelte'
	import Search from '$lib/search/Search.svelte'
	import Overlay from '$lib/ui/Overlay.svelte'
	import Modal from '$lib/ui/Modal.svelte'
</script>

<template lang="pug">
	
	Overlay
	
	.spacer-md

	Search

	.spacer-md

	Grid

	RightClickMenu

	Modal(bind:showModal!='{$showBookmarkEditor}' opacity='{0}')
		BookmarkEditor

	Modal(bind:showModal!='{$showFolderEditor}' opacity='{0}')
		FolderEditor

</template>
