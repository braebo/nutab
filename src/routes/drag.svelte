<script lang="ts">
	// Data
	import { bookmarkEditor, editorContext } from '$lib/stores/bookmarkEditor'
	import { emptyBookmark } from '$lib/data/bookmarks/defaults'
	import { activeBookmarks, activeFolder } from '$lib/data/dbStore'

	// Components
	import BookmarkEditor from '$lib/ui/Bookmarks/BookmarkEditor.svelte'
	import Draggables from '$lib/ui/Bookmarks/Draggables.svelte'
	import RightClickMenu from '$lib/ui/RightClickMenu.svelte'
	import { init_db } from '$lib/data/transactions'
	import Search from '$lib/search/Search.svelte'
	import Modal from '$lib/ui/Modal.svelte'
	import { onMount } from 'svelte'

	let showModal = false

	function showEditor(i: number) {
		$editorContext = 'edit'
		$bookmarkEditor = $activeBookmarks[i]
		showModal = true
	}

	function newBookmark() {
		$editorContext = 'create'
		$bookmarkEditor = emptyBookmark($activeFolder)
		showModal = true
	}

	onMount(() => init_db())
</script>

<Search />

<Draggables on:showEditor={(e) => showEditor(e.detail.index)} on:newBookmark={newBookmark} />

<RightClickMenu on:showEditor={(e) => showEditor(e.detail.index)} on:newBookmark={newBookmark} />

<Modal bind:showModal opacity={0}>
	<BookmarkEditor on:cancel={() => (showModal = false)} />
</Modal>
