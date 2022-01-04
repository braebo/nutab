<script>
	import { liveQuery } from 'dexie'
	import db from '$lib/data/db'
	import cuid from 'cuid'

	export let defaultUrl = 'https://www.example.com/'

	let status = ''

	let bookmarkTitle = ''
	let bookmarkUrl = defaultUrl

	async function addFriend() {
		try {
			// Add the new bookmark!
			const id = await db.bookmarks.add({
				bookmark_id: cuid(),
				title: bookmarkTitle,
				description: '',
				url: bookmarkUrl,
				tags: [],
				image: '',
				background: '#fff',
				foreground: '#000',
				position: (await db.bookmarks.count()) + 1
			})

			status = `Bookmark ${bookmarkTitle} successfully added. Got id ${id}`

			// Reset form:
			bookmarkTitle = ''
			bookmarkUrl = defaultUrl
		} catch (error) {
			status = `Failed to add ${bookmarkTitle}: ${error}`
		}
	}
</script>

<div>
	<p>{status}</p>
	<fieldset>
		<legend>Add new bookmark</legend>
		<label>
			Name:
			<input type="text" bind:value={bookmarkTitle} />
		</label>
		<br />
		<label>
			Age:
			<input type="number" bind:value={bookmarkUrl} />
		</label>
		<br />
		<button on:click={addFriend}>Add Friend</button>
	</fieldset>
</div>
