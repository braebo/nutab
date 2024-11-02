<script lang="ts">
	// Types
	import type { Folder } from '$lib/data/types'

	// Data
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import dexie from '$lib/data/dexie.svelte'
	import { db } from '$lib/data/db.svelte'

	// Utils
	import { smoothToggle } from '$lib/utils/smoothToggle'
	import { grid } from '$lib/stores/grid.svelte'
	import { Logger } from '$lib/utils/logger'
	import { fly } from 'svelte/transition'

	// Components
	import Tooltip from '$lib/ui/Tooltip.svelte'

	const { log } = new Logger('FolderSidebar')

	let hovering = $state(false)

	let isActive = $derived((id: Folder['folder_id']) => id === db.activeFolder?.folder_id)

	// Filters bookmark grid by tag
	const applyTagFilter = async (tag: string | null) => {
		if (tag === db.tagFilter || tag === null) {
			db.tagFilter = ''
		} else {
			db.tagFilter = tag
		}
		// log('🟠 FolderSidebar.applyTagFilter:  Tag filter = ' + db.tagFilter)
		grid.reRender()
		// log('🟠 db.filteredBookmarks:', $state.snapshot(db.filteredBookmarks))
	}

	// Debounced mouse hover for show / hide / animations
	let smoothHovering = $state(false)

	const smoothHover = smoothToggle((state) => (smoothHovering = state), [0, 500])

	const mouseOver = () => {
		hovering = true
		smoothHover(true)
	}

	const mouseOut = () => {
		hovering = false
		smoothHover(false)
	}

	// Selects a folder
	const handleFolderClick = async (id: Folder['folder_id']) => {
		if (db.tagFilter) applyTagFilter('')
		if (!isActive(id)) {
			await dexie.settings.put({ key: 'activeFolderId', value: id })

			// db.lastActiveFolderId = id
			grid.reRender()
		}
	}

	// Just opens a blank folder editor
	const newFolder = async () => {
		await bookmarkEditor.show(['create', 'folder'])
	}
</script>

<div class="folder-sidebar-container" onpointerover={mouseOver} onpointerleave={mouseOut}>
	<div class="folder-sidebar" class:hovering>
		{#if db.folders}
			{#each db.folders as { folder_id, icon, title }, i}
				<div
					class="_folder_"
					id={folder_id}
					role="button"
					tabindex={i}
					onclick={() => handleFolderClick(folder_id)}
					class:active={isActive(folder_id)}
				>
					<div class="folder-icon" class:active={isActive(folder_id)}>{icon}</div>
					<div class="folder-title" class:hovering>{title}</div>
				</div>
			{/each}
		{/if}

		<div class="new-folder" class:hovering onclick={newFolder}>
			<Tooltip content="New_Folder" placement="right" offset={[9, 20]}>+</Tooltip>
		</div>

		{#if (db.uniqueTags && smoothHovering) || db.tagFilter}
			<div
				class="tags"
				in:fly={{ x: -10, duration: 300 }}
				out:fly={{ x: -20, duration: 600 }}
			>
				{#if db.uniqueTags}
					{#each db.uniqueTags as tag, i}
						<div
							class="tag"
							class:active={db.tagFilter === tag}
							class:inactive={db.tagFilter && db.tagFilter !== tag}
						>
							<div
								role="button"
								tabindex={i}
								class="tag-title"
								class:hovering
								onclick={() => applyTagFilter(tag)}
							>
								<span class="hashtag">#</span>
								{tag}
							</div>
						</div>
					{/each}
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.folder-sidebar-container {
		position: fixed;
		display: flex;
		left: 0;
		top: 0;
		bottom: 0;

		height: 100vh;
		width: 200px;
		margin: auto;

		z-index: 10;

		top: clamp(200px, 20vh, 20rem);
		height: clamp(200px, 30vh, 30rem);
	}

	.folder-sidebar {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		height: max-content;
		min-width: 200px;
		padding: 3rem 2rem 3rem 2rem;

		z-index: 10;

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
				color: var(--bg-c);
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
				transition: filter 0.25s;
				pointer-events: none;

				font-size: 1.5rem;
				&:not(.active) {
					filter: saturate(0);
				}
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
				color: var(--bg-c);

				transition-delay: 0s;
			}
		}

		& .tags {
			position: absolute;

			top: 90%;
		}

		& .tag {
			padding: 1.5rem auto 0 0.5rem;

			color: var(--bg-d);
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
