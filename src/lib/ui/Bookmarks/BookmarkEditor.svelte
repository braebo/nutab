<script lang="ts">
	import type { Bookmark } from '$lib/data/types'

	import { createEventDispatcher, onMount, tick } from 'svelte'
	import { bookmarkEditor, editorContext } from '$lib/stores/bookmarkEditor'
	import { newBookmark } from '$lib/data/transactions'

	import BookmarkArt from '$lib/ui/Bookmarks/BookmarkArt.svelte'
	import Tags from '$lib/ui/Bookmarks/Tags.svelte'
	import Button from '$lib/ui/Button.svelte'

	import { getClipboardUrl } from '$lib/utils/getClipboardUrl'
	import { log } from 'fractils'

	export let i: number = 0
	export let bookmark_id: string = ''

	const dispatch = createEventDispatcher()

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

	function handleSave() {
		if ($editorContext === 'edit') {
			// TODO: update bookmark
			// updateBookmark(bookmark_id, $bookmarkEditor)
		} else {
			newBookmark($bookmarkEditor)
		}
	}

	onMount(async () => {
		titleInput.select()
		;(async function checkClipboard() {
			const clipboardContents = await getClipboardUrl()
			log('clipboardContents :', 'cyan', 'black', 25)
			log(clipboardContents, 'cyan', 'black', 25)

			$bookmarkEditor.url = clipboardContents
		})()
	})
</script>

<div class="editor-container">
	{#if $bookmarkEditor['image']}
		<img name="image" src={$bookmarkEditor['image']} alt={$bookmarkEditor['title']} />
	{:else}
		<!-- Fallback Image -->
		<div class="bookmark-art">
			<BookmarkArt
				--foreground={$bookmarkEditor['foreground']}
				--background={$bookmarkEditor['background']}
				--size="100px"
				title={$bookmarkEditor['title']}
			/>
			<div class="color-settings">
				<input name="background" type="color" bind:value={$bookmarkEditor['background']} />
				<input name="foreground" type="color" bind:value={$bookmarkEditor['foreground']} />
			</div>
		</div>
	{/if}

	<div class="setting title">
		<input
			name="title"
			placeholder="title"
			bind:this={titleInput}
			bind:value={$bookmarkEditor['title']}
			on:click={() => titleInput.select()}
		/>
	</div>

	<div class="setting description">
		<!-- <label for='description'>description</label> -->
		<input
			name="description"
			{placeholder}
			type="text"
			bind:this={descriptionInput}
			bind:value={$bookmarkEditor['description']}
			on:focus={() => {
				descriptionFocused = true
			}}
			on:blur={() => {
				descriptionFocused = false
			}}
		/>
	</div>

	<div class="setting">
		<!-- <label for="url">url</label> -->
		<input
			name="url"
			type="text"
			placeholder="url"
			bind:this={urlInput}
			on:click={() => urlInput.select()}
			bind:value={$bookmarkEditor['url']}
			autoComplete="off"
		/>
	</div>

	<div class="setting">
		<div name="tags" class="tags">
			<Tags
				on:updateTags={(e) => updateTags(e, i, bookmark_id)}
				bind:tags={$bookmarkEditor['tags']}
				placeholder={'new tag'}
				on:tags={handleTags}
				autoComplete={false}
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
			/>
		</div>
	</div>

	<div class="buttons">
		<Button
			--colorHover="var(--warn)"
			--borderHover="1px solid var(--warn)"
			on:click={() => dispatch('cancel')}>Cancel</Button
		>
		<Button
			--colorHover="var(--confirm)"
			--borderHover="1px solid var(--confirm)"
			on:click={handleSave}>Save</Button
		>
	</div>
</div>

<style lang="scss">
	.editor-container {
		display: flex;
		position: relative;
		flex-direction: column;

		width: 500px;
		height: max-content;
		margin: 30vh auto;

		border-radius: 10px;
		background: var(--light-a);
		color: var(--dark-a);
		box-shadow: 0 5px 15px 5px #00000011;

		perspective: 1200px;
		transform-style: preserve-3d;

		animation: floatDown ease-out 1s forwards;
		animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);

		/* 3d CSS Float Down Animation */
		@keyframes floatDown {
			0% {
				opacity: 0;

				transform: perspective(500px) translate3d(0, -5px, 25px);
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
	}

	input {
		width: 70%;
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
			border: 1px solid rgba(var(--light-b-rgb), 1);
		}
	}

	input[name='title'] {
		font-size: 1.5rem;
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

	input[type='color'] {
		width: 30px;
		height: 30px;
		padding: 0;

		opacity: 0.2;
		&:hover {
			opacity: 1;
		}

		transition: opacity 0.2s;
		cursor: pointer;
	}

	.tags {
		position: relative;

		width: 90%;
		height: 100%;
		margin: 1rem auto;

		font-family: var(--font-primary);
	}

	.buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: flex-end;
		justify-items: center;

		width: 15rem;
		margin: 2rem auto;

		gap: 1rem;
	}

	.bookmark-art {
		position: relative;

		perspective: 1200px;
		transform-style: preserve-3d;

		animation: floatDown ease-out 1.25s forwards;

		animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);

		/* 3d CSS Float Down Animation */
		@keyframes floatDown {
			0% {
				opacity: 0;
				transform: perspective(500px) translate3d(0, -25px, 50px);
			}
			100% {
				opacity: 1;
				transform: perspective(500px) translate3d(0, 0, 0);
			}
		}
	}
	.color-settings {
		position: absolute;
		top: 3rem;
		bottom: 0;
		left: 0;
		right: -10rem;
		display: flex;
		flex-direction: column;

		width: max-content;
		margin: auto;
	}

	img {
		display: flex;

		width: 100px;
		height: 100px;
		margin: 2rem auto 0 auto;
	}
</style>
