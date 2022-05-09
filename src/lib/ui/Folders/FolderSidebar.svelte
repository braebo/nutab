<script lang="ts">
	// Types
	import type { Folder } from '$lib/data/types'

	// Data
	import {
		activeBookmarks,
		activeFolder,
		activeFolderBookmarks,
		lastActiveFolderId,
		tagFilter,
		uniqueTags,
		folders
	} from '$lib/data/dbStore'
	import { getAllFolders_db, getFolder_db, newFolder_db } from '$lib/data/transactions'
	import { editor, folderEditor } from '$lib/stores/bookmarkEditor'
	import db from '$lib/data/db'

	// Utils
	import { smoothHover } from '$lib/utils/smoothHover'
	import { reRender } from '$lib/stores/gridStore'
	import { fly } from 'svelte/transition'
	import { onMount } from 'svelte'

	// Components
	import Tooltip from '$lib/ui/Tooltip.svelte'
	import { log, wait } from 'fractils'
	import { get } from 'svelte/store'

	let folderIcons = []
	let selectedTags: boolean[] | string[] = []

	onMount(async () => {
		$folders = await getAllFolders_db()
	})

	let hovering = false
	let sidebar: HTMLElement

	$: isActive = (id: Folder['folder_id']) => id === $activeFolder?.folder_id

	// Filters bookmark grid by tag
	const applyTagFilter = async (tag: string) => {
		if (tag === $tagFilter || tag === null) {
			$tagFilter = null
			// $activeBookmarks = $activeFolderBookmarks
		} else {
			$tagFilter = tag
		}
		// reRender()
		log('applyTagFilter:  Tag filter = ' + $tagFilter)
		reRender.set(!get(reRender))
	}

	// Debounced mouse hover for show / hide / animations
	let smoothHovering = false
	const smooth = smoothHover
	const mouseOver = async () => {
		hovering = true
		smooth.smoothOver(() => (smoothHovering = true), 0)
	}
	const mouseOut = () => {
		hovering = false
		smooth.smoothOut(() => (smoothHovering = false), 500)
	}

	// Selects a folder
	const handleFolderClick = async (id: Folder['folder_id']) => {
		if ($tagFilter != null) applyTagFilter(null)
		if (!isActive(id)) {
			$activeFolder = await getFolder_db(id)

			// This is a gnarly hack to wait for "activeFolderBookmarks"
			// derived store to update to the new activeFolder...
			setTimeout(() => {
				$activeBookmarks = $activeFolderBookmarks
			}, 100)

			$lastActiveFolderId = id
			$reRender = !$reRender
		}
	}

	// Just opens a blank folder editor
	const newFolder = async () => {
		await editor.show(['create', 'folder'])
	}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<template lang="pug">

	.folder-sidebar-container
		
		.folder-sidebar(
			bind:this='{sidebar}'
			class:hovering
			on:mouseover!='{mouseOver}'
			on:mouseout!='{mouseOut}'
		)

			+if ('$folders')
				
				+each('$folders as {folder_id, icon, title}, i')
					
					._folder_(
						id='{folder_id}'
						on:click!='{() => handleFolderClick(folder_id)}'
						class:active!='{isActive(folder_id)}'
					)
						.folder-icon(class:active!='{isActive(folder_id)}') {icon}
						.folder-title(class:hovering) {title}


			.new-folder(class:hovering on:click='{newFolder}')
				Tooltip(content='New_Folder' position='right' offset='{[9,20]}')
					| +


			+if ('$uniqueTags && smoothHovering || $tagFilter')

				.tags(
					in:fly='{{ x: -10, duration: 300 }}'
					out:fly='{{ x: -20, duration: 600 }}'
				)

					+if('$uniqueTags')

						+each('$uniqueTags as tag')

							.tag(
								class:active='{$tagFilter === tag}'
								class:inactive!='{$tagFilter && $tagFilter !== tag}'
							)

								.tag-title(class:hovering on:click!='{() => applyTagFilter(tag)}')
									span.hashtag # 
									| {tag}

</template>

<style lang="scss">
	.folder-sidebar-container {
		position: absolute;
		display: flex;
		align-items: center;
		left: 0;
		top: 0;

		height: 100vh;
		width: 200px;

		z-index: 0;
	}

	.folder-sidebar {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		height: max-content;
		min-width: 200px;
		padding: 3rem 2rem 3rem 2rem;

		& ._folder_ {
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-grow: 1;
			gap: 0.5rem;

			margin: 0.25rem 1rem;
			margin-left: 0;

			cursor: pointer;

			transition: transform 0.175s;
			transform: scale(0.75);
			transform-origin: 15% center;
			&.active {
				transform: scale(1);
			}

			& .folder-title {
				color: var(--dark-c);
				opacity: 0;

				font-family: var(--font-b);
				font-size: 1.25rem;

				transform: translateX(5px);
				transition: 0.2s;

				pointer-events: none;

				&.hovering {
					opacity: 1;

					transform: translateX(0px);
				}
			}
			& .folder-icon {
				font-size: 1.5rem;
				&:not(.active) {
					filter: saturate(0);
				}

				transition: filter 0.25s;
				pointer-events: none;
			}
		}
		&.hovering {
			& .folder-icon {
				filter: saturate(1);
			}
			& .new-folder {
				opacity: 1;

				transition-delay: 0.5s;
			}
		}

		& .new-folder {
			position: absolute;
			left: 1.75rem;
			bottom: 1.5rem;

			width: 2rem;
			height: 2rem;

			color: var(--light-d);
			opacity: 0;

			font-size: 1.5rem;
			text-align: center;
			vertical-align: center;

			cursor: pointer;

			transition: 0.2s;

			&:hover {
				color: var(--dark-c);

				transition-delay: 0s;
			}
		}

		& .tags {
			position: absolute;

			top: 90%;
		}

		& .tag {
			padding: 1.5rem auto 0 0.5rem;

			color: var(--dark-d);
			opacity: 0.3;

			transition: opacity 0.2s;
			cursor: pointer;

			transition-duration: 1s;

			&.inactive {
				opacity: 0.25;

				transition-duration: 1s;
			}
			&:hover {
				opacity: 0.75;

				transition-duration: 0.15s;
			}
			&.active {
				opacity: 1;
				& .hashtag {
					opacity: 0.5;
				}
			}

			.tag-title {
				padding: 0.25rem 0;
			}
		}

		& .hashtag {
			opacity: 0.5;

			font-size: 75%;
		}
	}

	.active {
		filter: saturate(1);

		.folder-icon {
			filter: saturate(1);
		}
	}
</style>
