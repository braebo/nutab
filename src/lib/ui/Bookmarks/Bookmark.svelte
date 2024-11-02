<script lang="ts">
	import type { Bookmark } from '$lib/data/types'

	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import { settings } from '$lib/stores/settings.svelte'
	import { smoothToggle } from '$lib/utils/smoothToggle'
	import { scale, fade, fly } from 'svelte/transition'
	import BookmarkArt from './BookmarkArt.svelte'

	let {
		i,
		hovering,
		dragging = false,
		bookmark = $bindable(),
		disableTransitions = false,
		onShowBookmarkEditor = () => {},
	}: {
		i: number
		bookmark: Bookmark
		hovering: number | null
		dragging?: boolean
		disableTransitions?: boolean
		onShowBookmarkEditor?: () => void
	} = $props()

	let url = $derived(bookmark?.url ?? '')
	let title = $derived(bookmark?.title ?? '')

	const toggleTitle = smoothToggle((s) => (settings.showTitle = s), [1500, 0])
</script>

<div class="bookmark-container">
	<a
		class="item-{i} grid-item"
		href={url}
		class:dragging
		draggable="false"
		oncontextmenu={(e) => {
			e.preventDefault()
			e.stopPropagation()
			bookmarkEditor.show(['edit', 'bookmark'], i)
			onShowBookmarkEditor()
		}}
	>
		<div
			role="button"
			tabindex="0"
			class="bookmark"
			in:scale={{ duration: disableTransitions ? 0 : 200 + 50 * i }}
			onmouseover={() => toggleTitle(true)}
			onfocus={() => toggleTitle(false)}
		>
			<BookmarkArt bind:bookmark />

			{#if (settings.showTitle || hovering == i) && title && !dragging}
				<p transition:fly={{ y: 3, duration: disableTransitions ? 0 : 100 }}>
					{title}
				</p>
			{/if}
		</div>
	</a>
</div>

<style lang="scss">
	.bookmark-container,
	.bookmark {
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: flex-end;
		pointer-events: none;
	}

	.bookmark-container {
		height: var(--size, 100%);
		width: var(--size, 100%);
	}

	.icon {
		display: flex;
		top: 0;
		bottom: 0;

		height: 100%;
		margin: auto;

		user-select: none;
	}

	p {
		position: absolute;

		width: fit-content;

		color: var(--bg-d);

		font-size: 16px;
		line-height: 150%;
		white-space: nowrap;
		letter-spacing: 2px;

		transform: translateY(120%);
	}

	a {
		position: absolute;
		inset: 0;

		margin: auto;
		width: max-content;
		height: max-content;

		color: var(--bg-a);

		text-decoration: none;

		pointer-events: all;
	}

	a.dragging {
		pointer-events: none;
		cursor: inherit;
	}
</style>
