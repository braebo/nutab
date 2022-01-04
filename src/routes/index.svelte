<script lang="ts">
	import type { Bookmark } from '$lib/data/types'

	// Data
	import { bookmarkEditor, editorContext } from '$lib/stores/bookmarkEditor'
	import { emptyBookmark } from '$lib/data/bookmarks/defaults'
	import { activeFolder } from '$lib/data/dbStore'

	// Components
	import BookmarkEditor from '$lib/ui/Bookmarks/BookmarkEditor.svelte'
	import RightClickMenu from '$lib/ui/RightClickMenu.svelte'
	import Grid from '$lib/ui/Bookmarks/Grid.svelte'
	import Search from '$lib/search/Search.svelte'
	import Modal from '$lib/ui/Modal.svelte'

	let showModal = false
	let bookmark_id = ''

	function showEditor({ i }: { i: number }) {
		bookmark_id = $activeFolder.bookmarks[i].bookmark_id
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
<br />

<Grid on:showEditor={(e) => showEditor(e.detail)} on:newBookmark={newBookmark} />

<RightClickMenu on:showEditor={(e) => showEditor(e.detail)} on:newBookmark={newBookmark} />

<Modal bind:showModal opacity={0}>
	<BookmarkEditor on:close={() => (showModal = false)} {bookmark_id} />
</Modal>
