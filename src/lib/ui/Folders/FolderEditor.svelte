<script lang="ts">
	import EmojiPicker from './EmojiPicker.svelte'
	// Types
	// import type { Bookmark } from '$lib/data/types'

	// Data
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	// import { uniqueTags } from '$lib/data/dbStore'
	import {
		getBookmarksWithSelectedTags_db,
		getFolderCount_db,
		putFolder_db,
		deleteFolder_db,
		addFolder_db,
	} from '$lib/data/transactions.svelte'
	import { db } from '$lib/data/db.svelte'

	// Components
	import DeleteFolder from './DeleteFolder.svelte'
	import Button from '$lib/ui/Button.svelte'

	// Utils
	import { clickOutside } from '$lib/utils/clickOutside'
	import { onMount } from 'svelte'
	// import { createId } from '@paralleldrive/cuid2'

	let emoji = '📌'
	let showEmojiPicker = $state(false)
	// svelte-ignore non_reactive_update
	let titleInput = $state<HTMLInputElement>()
	let header = $state('')
	let selectedTags: boolean[] = $state([])
	let folderCount = $state(0)
	let deleteDisabled = $derived(folderCount === 1)

	async function handleSave() {
		if (bookmarkEditor.folderEditor === null) {
			console.error('editor: No folder to save')
			return
		}
		if (bookmarkEditor.bookmarkEditorContext === 'edit') {
			putFolder_db(bookmarkEditor.folderEditor)
		} else {
			// Save the current Folder along with the relevant bookmark id's of any selected tags.
			const tags = selectedTags.reduce((acc, curr, i) => {
				// return curr ? [...acc, db.uniqueTags?.[i]] : acc
				const tag = db.uniqueTags?.[i]
				if (curr && tag) {
					acc.push(tag)
				}
				return acc
			}, [] as string[])
			bookmarkEditor.folderEditor.bookmark_ids = await getBookmarksWithSelectedTags_db(tags)
			addFolder_db(bookmarkEditor.folderEditor)
		}
		bookmarkEditor.hide()
	}

	async function handleDelete() {
		if (folderCount === 1) return
		if (bookmarkEditor.folderEditor === null) {
			console.error('editor: No folder to delete')
			return
		}
		await deleteFolder_db(bookmarkEditor.folderEditor)
		bookmarkEditor.hide()
	}

	onMount(async () => {
		if (bookmarkEditor.bookmarkEditorContext === 'create') {
			header = 'New Folder'
			titleInput?.select()
		} else {
			if (bookmarkEditor.folderEditor !== null) emoji = bookmarkEditor.folderEditor.icon
			folderCount = await getFolderCount_db()
		}
	})
</script>

{#if bookmarkEditor.folderEditor}
	<div class="editor-container" use:clickOutside onoutclick={() => bookmarkEditor.hide()}>
		<div class="space-sm"></div>
		<h2 class="header">{header}</h2>
		<div class="space-sm"></div>

		<div class="setting title">
			<div class="emoji" onpointerdown={() => (showEmojiPicker = !showEmojiPicker)}>
				{bookmarkEditor.folderEditor.icon}
			</div>
			{#if showEmojiPicker}
				<div class="emoji-picker">
					<EmojiPicker
						bind:showEmojiPicker
						bind:emoji={bookmarkEditor.folderEditor.icon}
					/>
				</div>
			{/if}
			<input
				class="title"
				placeholder="My Folder"
				bind:this={titleInput}
				bind:value={bookmarkEditor.folderEditor.title}
				onclick={() => titleInput?.select()}
				onkeydown={(e) => e.key === 'Enter' && handleSave()}
			/>
		</div>
		<div class="space-lg"></div>

		{#if bookmarkEditor.bookmarkEditorContext === 'create'}
			<div class="setting tag-manager scroller">
				<div class="info">Add bookmarks from tags (optional)</div>
				<div class="tags">
					{#if db.uniqueTags}
						{#each db.uniqueTags as tag, i}
							<div
								class="tag"
								class:selected={selectedTags[i]}
								onpointerdown={() => (selectedTags[i] = !selectedTags[i])}
							>
								{tag}
							</div>
						{/each}
					{/if}
				</div>
			</div>
		{/if}

		<div class="buttons">
			<Button
				--colorHover="var(--warn)"
				--borderHover="1px solid var(--warn)"
				onclick={() => bookmarkEditor.hide()}
			>
				Cancel
			</Button>

			<Button
				--colorHover="var(--confirm)"
				--borderHover="1px solid var(--confirm)"
				onclick={handleSave}
			>
				Save
			</Button>

			<DeleteFolder
				disabled={deleteDisabled}
				onclose={() => bookmarkEditor.hide()}
				onclick={handleDelete}
			/>
		</div>
	</div>
{/if}

<style lang="scss">
	.editor-container {
		display: flex;
		position: relative;
		flex-direction: column;
		flex-grow: 1;

		width: 500px;
		height: max-content;
		margin: 30vh auto;

		border-radius: 10px;
		background: var(--fg-a);
		color: var(--bg-a);
		box-shadow: 0 5px 15px 5px #00000011;

		perspective: 1200px;
		transform-style: preserve-3d;

		animation: floatUp ease-out 500ms forwards;
		animation-timing-function: cubic-bezier(0.175, 0.585, 0.52, 1);

		/* 3d CSS Float Down Animation */
		@keyframes floatUp {
			0% {
				opacity: 0;

				transform: perspective(500px) translate3d(0, -5px, -50px);
			}
			100% {
				opacity: 1;

				transform: perspective(500px) translate3d(0, 0, 0);
			}
		}
	}

	.header {
		margin: 1rem auto;

		color: var(--bg-a);

		text-align: center;
		font-size: 1.5rem;
	}

	.setting {
		display: flex;
		position: relative;
		justify-content: space-around;

		font-size: 1.3rem;

		z-index: 12;
	}

	input {
		width: 50%;
		padding: 8px;

		color: var(--bg-a);
		border: 1px solid color-mix(in srgb, var(--fg-b) 0%, transparent);
		border-radius: 3px;
		outline: none;
		background: var(--fg-a);
		box-shadow: var(--shadow-sm);
		border-bottom: 1px solid color-mix(in srgb, var(--fg-b) 100%, transparent);

		font-family: 'Abel';
		font-size: 1rem;
		text-align: center;

		transition: border 0.2s;

		&:focus {
			&::placeholder {
				opacity: 0;
			}
		}
	}

	input.title {
		min-width: max-content;
		max-width: 90%;

		font-size: 1.25rem;

		border: 1px solid color-mix(in srgb, var(--bg-a) 10%, transparent);
		&:hover {
			border: 1px solid color-mix(in srgb, var(--bg-a) 50%, transparent);
		}
		&:focus {
			border: 1px solid color-mix(in srgb, var(--bg-a) 100%, transparent);
		}
	}

	.title {
		display: flex;
		justify-content: center;
		align-items: center;

		margin: auto;

		transform: translateX(-0.4rem);
	}

	.emoji {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 40px;
		height: 40px;
		margin: auto;

		cursor: pointer;
		transform: translateX(-2rem);

		border-radius: 4px;
		border: 1px solid color-mix(in srgb, var(--bg-a) 10%, transparent);
		&:hover {
			border: 1px solid color-mix(in srgb, var(--bg-a) 50%, transparent);
		}
		&:focus {
			border: 1px solid color-mix(in srgb, var(--bg-a) 100%, transparent);
		}
	}

	.emoji-picker {
		position: absolute;

		left: -150%;
		top: -220%;
	}

	.tag-manager {
		display: flex;
		flex-direction: column;

		width: 90%;
		margin: auto;

		border: 1px solid var(--fg-b);
		border-radius: 5px;
		opacity: 0.5;

		&:hover {
			opacity: 1;
		}
	}

	.info {
		margin: 1rem auto;

		color: var(--bg-c);

		text-align: center;
		font-size: 0.95rem;
	}

	.tags {
		position: relative;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 10px;

		max-width: 95%;
		max-height: 200px;
		margin: 1rem auto;

		font-family: var(--font-a);

		transition: opacity 0.2s;
	}

	.tag {
		display: flex;
		justify-content: center;

		height: max-content;
		padding: 0.25rem 0.4rem;

		opacity: 0.5;
		border: 1px solid;
		border-radius: 5px;
		border-color: color-mix(in srgb, var(--bg-a) 25%, transparent);

		font-size: 0.95rem;
		text-align: center;

		cursor: pointer;
		transition: 0.15s;

		&:hover {
			opacity: 0.75;
			border-color: color-mix(in srgb, var(--bg-a) 50%, transparent);
		}

		&.selected {
			opacity: 1;
			border-color: var(--bg-a);
		}
	}

	.buttons {
		display: grid;
		position: relative;
		grid-template-columns: 1fr 1fr;
		align-items: flex-end;
		justify-items: center;

		width: 15rem;
		margin: 2rem auto;

		gap: 1rem;

		z-index: 11;
	}

	/* 3d CSS Float Down Animation */
	@keyframes floatDown {
		0% {
			opacity: 0;

			transform: perspective(500px) translate3d(0, -25px, 50px) scale(1.2);
		}
		100% {
			opacity: 1;

			transform: perspective(500px) translate3d(0, 0, 0) scale(1);
		}
	}
</style>
