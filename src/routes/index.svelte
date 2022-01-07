<script lang="ts">
	import type { Bookmark } from '$lib/data/types'

	// Data
	import { bookmarkEditor, editorContext } from '$lib/stores/bookmarkEditor'
	import { activeBookmarks, activeFolder } from '$lib/data/dbStore'
	import { emptyBookmark } from '$lib/data/bookmarks/defaults'

	// Components
	import BookmarkEditor from '$lib/ui/Bookmarks/BookmarkEditor.svelte'
	import RightClickMenu from '$lib/ui/RightClickMenu.svelte'
	import { getBookmark_db } from '$lib/data/transactions'
	import Grid from '$lib/ui/Bookmarks/Grid.svelte'
	import Search from '$lib/search/Search.svelte'
	import Modal from '$lib/ui/Modal.svelte'

	let showModal = false
	let bookmark_id = ''

	async function showEditor({ i }: { i: number }) {
		const id = $activeBookmarks[i].bookmark_id
		bookmark_id = id
		$editorContext = 'edit'
		$bookmarkEditor = await getBookmark_db(id)
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
