<script lang="ts">
	// Data
	import { addBookmark_db, updateBookmark_db } from '$lib/data/transactions.svelte'
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	// import { uniqueTags } from '$lib/data/dbStore'
	import { grid } from '$lib/stores/grid.svelte'
	import { db } from '$lib/data/db.svelte'

	// Components
	import BookmarkImageEditor from './BookmarkImageEditor.svelte'
	import DeleteBookmark from './DeleteBookmark.svelte'
	import Tags from '$lib/ui/Bookmarks/Tags.svelte'
	import Button from '$lib/ui/Button.svelte'

	// Utils
	import { fade } from 'svelte/transition'
	import { onMount } from 'svelte'

	interface Props {
		i?: number
	}

	let { i = 0 }: Props = $props()

	let titleInput = $state<HTMLInputElement>()
	let urlInput = $state<HTMLInputElement>()
	let descriptionInput = $state<HTMLInputElement>()
	let descriptionFocused = $state(false)
	let placeholder = $derived(descriptionFocused ? '' : 'description')

	// let tag = ''
	// function handleTags(tags: string[]) {
	// 	tag = tags
	// }
	async function updateTags(tags: string[], _index: number, _id: string) {
		if (!bookmarkEditor.editor) return
		bookmarkEditor.editor['tags'] = tags
	}

	async function handleSave() {
		if (!bookmarkEditor.editor?.url) {
			urlInput?.style.setProperty('border', '1px solid var(--warn)')
			await new Promise((r) => setTimeout(r, 1000))
			urlInput?.style.setProperty('border', '1px solid transparent')
			return
		}
		if (!bookmarkEditor.editor.image && bookmarkEditor.editor.useImage) {
			bookmarkEditor.editor.useImage = false
		}
		if (bookmarkEditor.bookmarkEditorContext === 'edit') {
			updateBookmark_db($state.snapshot(bookmarkEditor.editor))
		} else {
			await addBookmark_db($state.snapshot(bookmarkEditor.editor))
		}
		bookmarkEditor.hide()
		grid.reRender()
	}

	onMount(async () => {
		if (bookmarkEditor.bookmarkEditorContext === 'create') titleInput?.select()
	})
</script>

<div>
	{#if bookmarkEditor.showBookmarkEditor && bookmarkEditor.editor}
		<div class="editor-container" out:fade={{ duration: 100 }}>
			<BookmarkImageEditor />

			<div class="setting title">
				<input
					name="title"
					placeholder="title"
					bind:this={titleInput}
					bind:value={bookmarkEditor.editor.title}
					onclick={() => titleInput?.select()}
					onkeydown={(e) => e.key === 'Enter' && handleSave()}
				/>
			</div>

			<div class="setting description">
				<input
					type="text"
					{placeholder}
					name="description"
					bind:this={descriptionInput}
					bind:value={bookmarkEditor.editor.description}
					onfocus={() => (descriptionFocused = true)}
					onblur={() => (descriptionFocused = false)}
				/>
			</div>

			<div class="setting">
				<input
					name="url"
					type="text"
					placeholder="url"
					bind:this={urlInput}
					onclick={() => urlInput?.select()}
					bind:value={bookmarkEditor.editor.url}
					autoComplete="off"
				/>
			</div>

			<div class="setting">
				<div title="tags" class="tags">
					<Tags
						onTagChange={(tags) => {
							updateTags(tags, i, bookmarkEditor.editor?.bookmark_id ?? '')
						}}
						bind:tags={bookmarkEditor.editor['tags']}
						placeholder={'new tag'}
						autoComplete={db.uniqueTags ? db.uniqueTags : false}
						allowPaste={true}
						onlyUnique={true}
						removeKeys={[46]}
						addKeys={[9, 13]}
						allowDrop={true}
						allowBlur={true}
						splitWith={'/'}
						name={'tags'}
						maxTags={10}
						minChars={2}
						id="editor"
					/>
				</div>
			</div>

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

				<DeleteBookmark
					bookmark_id={bookmarkEditor.editor?.bookmark_id}
					on:close={() => bookmarkEditor.hide()}
				/>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.editor-container {
		display: flex;
		position: relative;
		flex-direction: column;

		width: 500px;
		height: max-content;
		margin: 30vh auto;
		padding: 0.5rem 0;

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

	.setting {
		display: flex;
		position: relative;
		justify-content: space-around;

		font-size: 1.3rem;

		z-index: 12;
	}

	input {
		width: 60%;
		padding: 5px 8px 5px 8px;

		color: var(--bg-a);
		border: 1px solid color-mix(in srgb, var(--fg-b) 0%, transparent);
		border-radius: 3px;
		outline: none;
		background: var(--fg-a);

		font-family: 'Abel';
		font-size: 1rem;
		text-align: center;

		transition: border 0.2s;

		&:focus {
			&::placeholder {
				opacity: 0;
			}
		}
		&:focus,
		&:hover {
			border-bottom: 1px solid color-mix(in srgb, var(--fg-b) 100%, transparent);
		}
	}

	input[name='title'] {
		font-size: 1.5rem;
		font-family: var(--font-a);
		letter-spacing: 1px;
	}
	input[name='url'] {
		margin: auto;
		margin-bottom: 1.1rem;

		color: var(--bg-d);

		font: 0.8rem monospace;
	}

	input[name='description'] {
		margin: 0 auto 2rem auto;

		color: color-mix(in srgb, var(--bg-d) 75%, transparent);

		&::placeholder {
			color: color-mix(in srgb, var(--bg-d) 25%, transparent);
		}
	}

	.tags {
		position: relative;

		width: 90%;
		height: 100%;
		margin: 1rem auto;

		font-family: var(--font-a);
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
</style>
