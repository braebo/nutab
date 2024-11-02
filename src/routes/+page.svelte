<script lang="ts">
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'

	import BookmarkEditor from '$lib/ui/Bookmarks/BookmarkEditor.svelte'
	import FolderEditor from '$lib/ui/Folders/FolderEditor.svelte'
	import RightClickMenu from '$lib/ui/RightClickMenu.svelte'
	import Grid from '$lib/ui/Bookmarks/Grid.svelte'
	import Search from '$lib/search/Search.svelte'
	import Overlay from '$lib/ui/Overlay.svelte'
	import Modal from '$lib/ui/Modal.svelte'
	import Root from './Root.svelte'
</script>

<Root>
	<Overlay />

	<div class="br-md"></div>

	<Search />

	<div class="br-md"></div>

	<Grid />

	<RightClickMenu />

	<Modal bind:showModal={bookmarkEditor.showBookmarkEditor} opacity={0}>
		<BookmarkEditor />
	</Modal>

	<Modal bind:showModal={bookmarkEditor.showFolderEditor} opacity={0}>
		<FolderEditor />
	</Modal>
</Root>
