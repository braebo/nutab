<script lang="ts">
	import { activeFolder } from '$lib/data/dbStore'

	import RightClickMenu from '$lib/ui/RightClickMenu.svelte'
	import BookmarkEditor from '$lib/ui/BookmarkEditor.svelte'
	import { emptyBookmark } from '$lib/data/emptyBookmark'
	import Folder from '$lib/ui/Folder.svelte'
	import Modal from '$lib/ui/Modal.svelte'

	import Search from '$lib/search/Search.svelte'
	import type { Bookmark } from '$lib/data/types'
	import { selectText } from '$lib/utils/selectText'

	let showModal = false,
		editorSettings: Bookmark

	function showEditor(i: number) {
		editorSettings = $activeFolder.bookmarks[i]
		showModal = true
	}

	function newBookmark() {
		editorSettings = emptyBookmark($activeFolder.folder_id, $activeFolder.title)
		showModal = true
		setTimeout(() => {
			selectText('title')
		}, 10)
	}
</script>

<!-- routify:options title="Home" -->
<!-- routify:options index=true -->

<br />

<Search />

<br />

<Folder on:showEditor={(e) => showEditor(e.detail.index)} on:newBookmark={newBookmark} />

<RightClickMenu on:showEditor={(e) => showEditor(e.detail.index)} />

<Modal bind:showModal opacity={0}>
	<BookmarkEditor bind:editorSettings />
</Modal>
