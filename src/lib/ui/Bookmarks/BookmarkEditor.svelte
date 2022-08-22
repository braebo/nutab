<script lang="ts">
	// Data
	import { showBookmarkEditor, bookmarkEditor, bookmarkEditorContext } from '$lib/stores'
	import { newBookmark_db, updateBookmark_db } from '$lib/data/transactions'
	import { editor } from '$lib/stores/bookmarkEditor'
	import { reRender } from '$lib/stores/gridStore'
	import { uniqueTags } from '$lib/data/dbStore'

	// Components
	import BookmarkImageEditor from './BookmarkImageEditor.svelte'
	import DeleteBookmark from './DeleteBookmark.svelte'
	import Tags from '$lib/ui/Bookmarks/Tags.svelte'
	import Button from '$lib/ui/Button.svelte'

	// Utils
	import { fade } from 'svelte/transition'
	import { onMount } from 'svelte'

	import { wait } from 'fractils'

	export let i: number = 0

	let titleInput: HTMLInputElement
	let urlInput: HTMLInputElement
	let descriptionInput: HTMLInputElement
	let descriptionFocused = false
	$: placeholder = descriptionFocused ? '' : 'description'

	let tag = ''
	function handleTags(event: CustomEvent) {
		tag = event.detail.tags
	}
	async function updateTags(event: CustomEvent, index: number, id: string) {
		$bookmarkEditor['tags'] = event.detail.tags
	}

	async function handleSave() {
		if (!$bookmarkEditor.url) {
			urlInput.style.border = '1px solid var(--warn)'
			await wait(1000)
			urlInput.style.border = '1px solid transparent'
			return
		}
		if ($bookmarkEditorContext === 'edit') {
			updateBookmark_db($bookmarkEditor)
		} else {
			await newBookmark_db($bookmarkEditor)
		}
		editor.hide()
		$reRender = !$reRender
	}

	onMount(async () => {
		if ($bookmarkEditorContext === 'create') titleInput?.select()
	})
</script>

<div>
	{#if $showBookmarkEditor && $bookmarkEditor}
		<div class="editor-container" out:fade={{ duration: 100 }}>
			<BookmarkImageEditor />

			<div class="setting title">
				<input
					name="title"
					placeholder="title"
					bind:this={titleInput}
					bind:value={$bookmarkEditor.title}
					on:click={() => titleInput.select()}
					on:keydown={(e) => e.key === 'Enter' && handleSave()}
				/>
			</div>

			<div class="setting description">
				<input
					name="description"
					{placeholder}
					type="text"
					bind:this={descriptionInput}
					bind:value={$bookmarkEditor.description}
					on:focus={() => {
						descriptionFocused = true
					}}
					on:blur={() => {
						descriptionFocused = false
					}}
				/>
			</div>

			<div class="setting">
				<input
					name="url"
					type="text"
					placeholder="url"
					bind:this={urlInput}
					on:click={() => urlInput.select()}
					bind:value={$bookmarkEditor.url}
					autoComplete="off"
				/>
			</div>

			<div class="setting">
				<div name="tags" class="tags">
					<Tags
						on:updateTags={(e) => updateTags(e, i, $bookmarkEditor.bookmark_id)}
						bind:tags={$bookmarkEditor['tags']}
						placeholder={'new tag'}
						on:tags={handleTags}
						autoComplete={$uniqueTags ? $uniqueTags : false}
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
				<Button --colorHover="var(--warn)" --borderHover="1px solid var(--warn)" on:click={() => editor.hide()}>
					Cancel
				</Button>

				<Button --colorHover="var(--confirm)" --borderHover="1px solid var(--confirm)" on:click={handleSave}>
					Save
				</Button>

				<DeleteBookmark bookmark_id={$bookmarkEditor?.bookmark_id} on:close={() => editor.hide()} />
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
		background: var(--light-a);
		color: var(--dark-a);
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

		color: var(--dark-a);
		border: 1px solid rgba(var(--light-b-rgb), 0);
		border-radius: 3px;
		outline: none;
		background: var(--light-a);

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
			border-bottom: 1px solid rgba(var(--light-b-rgb), 1);
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

		color: var(--dark-d);

		font: 0.8rem monospace;
	}

	input[name='description'] {
		margin: 0 auto 2rem auto;

		color: rgba(var(--dark-d-rgb), 0.75);

		&::placeholder {
			color: rgba(var(--dark-d-rgb), 0.25);
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
