<script lang="ts">
	// Data
	import { showEditor } from '$lib/stores/bookmarkEditor'

	// Components
	import BookmarkEditor from '$lib/ui/Bookmarks/BookmarkEditor.svelte'
	import RightClickMenu from '$lib/ui/RightClickMenu.svelte'
	import Grid from '$lib/ui/Bookmarks/Grid.svelte'
	import Search from '$lib/search/Search.svelte'
	import Modal from '$lib/ui/Modal.svelte'
	import FolderEditor from '$lib/ui/Folders/FolderEditor.svelte'
</script>

<br />

<Search />

<br />
<br />

<Grid />

<RightClickMenu />

<Modal bind:showModal={$showEditor} opacity={0}>
	<FolderEditor />
	<BookmarkEditor />
</Modal>
