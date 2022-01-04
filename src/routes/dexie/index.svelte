<script lang="ts">
	import type { Bookmark } from '$lib/data/types'
	import { liveQuery } from 'dexie'
	import type { Observable } from 'dexie'
	import db from '$lib/data/db'

	const bookmarks: Observable<Bookmark[]> = liveQuery(async (): Promise<Bookmark[]> => {
		//
		// Query the DB using our promise based API.
		// The end result will magically become
		// observable.
		//
		return await db.bookmarks.where('tags').equals('General').toArray()
	})
</script>

<div>
	<h2>Bookmarks</h2>
	<ul>
		{#each $bookmarks || [] as bookmark (bookmark.bookmark_id)}
			<li>{bookmark.title}, {bookmark.url}</li>
		{/each}
	</ul>
</div>
