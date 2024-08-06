<script lang="ts">
	import EmojiPicker from './EmojiPicker.svelte'
	// Types
	import type { Bookmark } from '$lib/data/types'

	// Data
	import { folderEditor, bookmarkEditorContext } from '$lib/stores/bookmarkEditor'
	import { editor } from '$lib/stores/bookmarkEditor'
	import { uniqueTags } from '$lib/data/dbStore'
	import {
		getBookmarksWithSelectedTags_db,
		getFolderCount_db,
		updateFolder_db,
		deleteFolder_db,
		newFolder_db,
	} from '$lib/data/transactions'

	// Components
	import DeleteFolder from './DeleteFolder.svelte'
	import Button from '$lib/ui/Button.svelte'

	// Utils
	import { clickOutside } from 'fractils'
	import { onMount } from 'svelte'
	import cuid from 'cuid'

	let emoji = '📌'
	let showEmojiPicker = false
	let titleInput: HTMLInputElement
	let header = ''
	let selectedTags: boolean[] = []
	let folderCount = 0
	$: deleteDisabled = folderCount === 1

	async function handleSave() {
		if ($bookmarkEditorContext === 'edit') {
			updateFolder_db($folderEditor)
		} else {
			// Save the current Folder along with the relevant bookmark id's of any selected tags.
			// @ts-ignore
			const tags = selectedTags.reduce((acc, curr, i) => (curr === true ? [...acc, $uniqueTags[i]] : []), [])
			$folderEditor.bookmarks = await getBookmarksWithSelectedTags_db(tags)
			newFolder_db($folderEditor)
		}
		editor.hide()
	}

	async function handleDelete() {
		if (folderCount === 1) return
		await deleteFolder_db($folderEditor)
		editor.hide()
	}

	onMount(async () => {
		if ($bookmarkEditorContext === 'create') {
			header = 'New Folder'
			titleInput?.select()
		} else {
			if ($folderEditor !== null) emoji = $folderEditor.icon
			folderCount = await getFolderCount_db()
		}
	})
</script>

<template lang="pug">

	+if('$folderEditor')
		.editor-container(use:clickOutside!='{() => editor.hide()}')
			.space-sm
			h2.header {header}
			.space-sm

			.setting.title
				.emoji(on:click!='{() => showEmojiPicker = !showEmojiPicker}') {$folderEditor.icon}
				+if('showEmojiPicker')
					.emoji-picker
						EmojiPicker(bind:showEmojiPicker bind:emoji='{$folderEditor.icon}')
				input.title(
					placeholder="My Folder"
					bind:this='{titleInput}'
					bind:value='{$folderEditor.title}'
					on:click!='{() => titleInput.select()}'
					on:keydown!='{(e) => e.key === "Enter" && handleSave()}'
				)
			.space-lg

			+if('$bookmarkEditorContext === "create"')
				.setting.tag-manager.scroller
					.info Add bookmarks from tags (optional)
					.tags
						+if('$uniqueTags')
							+each('$uniqueTags as tag, i')
								.tag(
									class:selected='{selectedTags[i]}'
									on:click!='{() => selectedTags[i] = !selectedTags[i]}'
								) {tag}

			.buttons
				Button(
					'--colorHover'='var(--warn)'
					'--borderHover'='1px solid var(--warn)'
					on:click!='{() => editor.hide()}'
				) Cancel

				Button(
					'--colorHover'='var(--confirm)'
					'--borderHover'='1px solid var(--confirm)'
					on:click='{handleSave}'
				) Save

				DeleteFolder(disabled='{deleteDisabled}' on:close!='{() => editor.hide()}' on:click='{handleDelete}')

</template>

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

	.header {
		margin: 1rem auto;

		color: var(--dark-a);

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

		color: var(--dark-a);
		border: 1px solid rgba(var(--light-b-rgb), 0);
		border-radius: 3px;
		outline: none;
		background: var(--light-a);
		box-shadow: var(--shadow-sm);
		border-bottom: 1px solid rgba(var(--light-b-rgb), 1);

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

		border: 1px solid rgba(var(--dark-a-rgb), 0.1);
		&:hover {
			border: 1px solid rgba(var(--dark-a-rgb), 0.5);
		}
		&:focus {
			border: 1px solid rgba(var(--dark-a-rgb), 1);
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
		border: 1px solid rgba(var(--dark-a-rgb), 0.1);
		&:hover {
			border: 1px solid rgba(var(--dark-a-rgb), 0.5);
		}
		&:focus {
			border: 1px solid rgba(var(--dark-a-rgb), 1);
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

		border: 1px solid var(--light-b);
		border-radius: 5px;
		opacity: 0.5;

		&:hover {
			opacity: 1;
		}
	}

	.info {
		margin: 1rem auto;

		color: var(--dark-c);

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
		border-color: rgba(var(--dark-a-rgb), 0.25);

		font-size: 0.95rem;
		text-align: center;

		cursor: pointer;
		transition: 0.15s;

		&:hover {
			opacity: 0.75;
			border-color: rgba(var(--dark-a-rgb), 0.5);
		}

		&.selected {
			opacity: 1;
			border-color: var(--dark-a);
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
