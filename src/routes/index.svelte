<script lang="ts">
	import type { Bookmark } from '$lib/data/types'

	// Data
	import { bookmarkEditor, editorContext } from '$lib/stores/bookmarkEditor'
	import { emptyBookmark } from '$lib/data/bookmarks/defaults'
	import { activeFolder } from '$lib/data/dbStore'

	// Components
	import BookmarkEditor from '$lib/ui/Bookmarks/BookmarkEditor.svelte'
	import RightClickMenu from '$lib/ui/RightClickMenu.svelte'
	import Folder from '$lib/ui/Bookmarks/Folder.svelte'
	import Search from '$lib/search/Search.svelte'
	import Modal from '$lib/ui/Modal.svelte'
	import DnDFolder from '$lib/ui/Bookmarks/DnDFolder.svelte'

	let showModal = false

	function showEditor(i: number) {
		$editorContext = 'edit'
		$bookmarkEditor = $activeFolder.bookmarks[i]
		showModal = true
	}

	function newBookmark() {
		$editorContext = 'create'
		$bookmarkEditor = emptyBookmark($activeFolder)
		showModal = true
	}
</script>

<br />

<Search />

<br />

<!-- <Folder on:showEditor={(e) => showEditor(e.detail.index)} on:newBookmark={newBookmark} /> -->
<DnDFolder on:showEditor={(e) => showEditor(e.detail.index)} on:newBookmark={newBookmark} />

<RightClickMenu on:showEditor={(e) => showEditor(e.detail.index)} on:newBookmark={newBookmark} />

<Modal bind:showModal opacity={0}>
	<BookmarkEditor on:cancel={() => (showModal = false)} />
</Modal>
