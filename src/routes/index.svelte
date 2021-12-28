<script lang="ts">
	import type { Bookmark } from '$lib/data/types'

	// Data
	import { emptyBookmark } from '$lib/data/bookmarks/defaults'
	import { activeFolder } from '$lib/data/dbStore'

	// UI
	import BookmarkEditor from '$lib/ui/Bookmarks/BookmarkEditor.svelte'
	import RightClickMenu from '$lib/ui/RightClickMenu.svelte'
	import Folder from '$lib/ui/Bookmarks/Folder.svelte'
	import Search from '$lib/search/Search.svelte'
	import Modal from '$lib/ui/Modal.svelte'

	let showModal = false,
		editorSettings: Bookmark

	function showEditor(i: number) {
		editorContext = 'edit'
		editorSettings = emptyBookmark($activeFolder.title)
		showModal = true
	}

	function newBookmark() {
		editorContext = 'create'
		editorSettings = emptyBookmark($activeFolder.title)
		showModal = true
	}

	let editorContext: 'edit' | 'create' = 'edit'
</script>

<br />

<Search />

<br />

<Folder on:showEditor={(e) => showEditor(e.detail.index)} on:newBookmark={newBookmark} />

<RightClickMenu on:showEditor={(e) => showEditor(e.detail.index)} />

<Modal bind:showModal opacity={0}>
	<BookmarkEditor bind:editorContext bind:editorSettings on:cancel={() => (showModal = false)} />
</Modal>
