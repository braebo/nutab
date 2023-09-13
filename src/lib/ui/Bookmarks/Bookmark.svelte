<script lang="ts">
	import type { Bookmark } from '$lib/data/types'

	import { editor } from '$lib/stores/bookmarkEditor'
	import { scale, fade } from 'svelte/transition'
	import { debounce } from '$lib/utils/debounce'
	import BookmarkArt from './BookmarkArt.svelte'
	import { bookmarkEditor } from '$lib/stores'
	import { settings } from '$lib/stores'

	export let i: number
	export let hovering: number
	export let dragging = false
	export let bookmark: Bookmark
	export let disableTransitions = false

	$: disableTransitions // is this necessary?
	$: url = bookmark?.url

	$: title = bookmark?.title
</script>

<div class="bookmark-container">
	<a
		class="item-{i} grid-item"
		href={url}
		class:dragging
		draggable="false"
		on:contextmenu|stopPropagation|preventDefault={() => editor.show(['edit', 'bookmark'], i)}
	>
		<div
			class="bookmark"
			in:scale|global={{ duration: disableTransitions ? 0 : 200 + 50 * i }}
			on:mouseover={() => debounce(() => ($settings.showTitle = true), 1500)}
			on:focus={() => debounce(() => ($settings.showTitle = false))}
		>
			<BookmarkArt bind:bookmark />

			{#if $settings.showTitle || hovering == i}
				{#if title && !dragging}
					<p transition:fade|global={{ duration: disableTransitions ? 0 : 100 }}>
						{title}
					</p>
				{/if}
			{/if}
		</div>
	</a>
</div>

<style>
	.bookmark-container {
		position: relative;
		display: flex;
		position: relative;
		align-items: center;
		flex-direction: column;
		justify-content: flex-end;

		height: var(--size, 100%);
		width: var(--size, 100%);

		pointer-events: none;
	}

	.bookmark {
		display: flex;
		position: relative;
		align-items: center;
		flex-direction: column;
		justify-content: flex-end;

		/* width: var(--size, 100%); */
		/* height: var(--size, 100%); */
		/* margin: auto; */

		/* background-repeat: no-repeat; */
		/* background-position: center; */

		/* border-radius: 10px; */

		/* text-align: center; */

		pointer-events: none;
	}

	.icon {
		display: flex;
		top: 0;
		bottom: 0;

		/* max-width: 100%; */
		/* max-height: 100%; */
		height: 100%;
		margin: auto;

		user-select: none;
	}

	p {
		position: absolute;

		width: fit-content;

		color: var(--dark-d);

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

		color: var(--dark-a);

		text-decoration: none;

		pointer-events: all;
	}

	a.dragging {
		pointer-events: none;
		cursor: inherit;
	}
</style>
