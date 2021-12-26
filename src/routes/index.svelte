<script lang="ts">
	import { activeCollection } from '$lib/data/dbStore'

	import RightClickMenu from '$lib/ui/RightClickMenu.svelte'
	import BookmarkEditor from '$lib/ui/BookmarkEditor.svelte'
	import Collection from '$lib/ui/Collection.svelte'
	import Modal from '$lib/ui/Modal.svelte'

	import Search from '$lib/search/Search.svelte'
	import type { Bookmark } from '$lib/data/types'

	let showModal = false,
		editorSettings: Bookmark

	function showEditor(i) {
		editorSettings = $activeCollection.bookmarks[i]
		showModal = true
	}
</script>

<!-- routify:options title="Home" -->
<!-- routify:options index=true -->

<br />

<Search />

<br />

<Collection on:showEditor={(e) => showEditor(e.detail.index)} />

<RightClickMenu on:showEditor={(e) => showEditor(e.detail.index)} />

<Modal bind:showModal opacity={0}>
	<BookmarkEditor bind:editorSettings />
</Modal>
