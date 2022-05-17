<script lang="ts">
	import type { Bookmark } from '$lib/data/types'

	import { settings } from '$lib/data/settings/settingsStore'
	import { scale, fade } from 'svelte/transition'

	import BookmarkArt from './BookmarkArt.svelte'
	import { smoothHover } from '$lib/utils/smoothHover'
	import { onMount } from 'svelte'

	export let i: number
	export let hovering: number
	export let dragging = false
	export let bookmark: Bookmark
	export let disableTransitions = false
	$: disableTransitions // is this necessary?

	$: url = bookmark?.url
	$: title = bookmark?.title
	$: image = bookmark?.image
	$: background = bookmark?.background
	$: foreground = bookmark?.foreground

	let aspectRatio = '1'

	// Get the aspect ratio of the image if it exists
	onMount(() => {
		if (image) {
			const img = new Image()
			img.addEventListener('load', (e) => {
				const width = img.naturalWidth
				const height = img.naturalHeight
				if (!isNaN(width) && !isNaN(height)) {
					aspectRatio = `${width} / ${height}`
				}
			})
			img.src = image
		}
	})
</script>

<div class="bookmark-container" style:pointer-events="none">
	<a target="_blank" href={url} draggable="false" class:dragging>
		{#if image}
			<div
				in:scale={{ duration: disableTransitions ? 0 : 200 + 50 * i }}
				class="bookmark"
				style="
				width: {$settings.ranges.iconSize.value}px;
				height: {$settings.ranges.iconSize.value}px;

				color: {$settings.transparent ? 'transparent' : foreground};
				background: {$settings.transparent ? 'transparent' : background};
				"
			>
				<img
					style:aspect-ratio={aspectRatio}
					class="icon icon{i}"
					draggable="false"
					src={image}
					alt={title}
					on:mouseover={() => smoothHover.smoothOver(() => ($settings.showTitle = true), 1500)}
					on:focus={() => smoothHover.smoothOver(() => ($settings.showTitle = false))}
				/>
				{#if $settings.showTitle || hovering == i}
					{#if title && !dragging}
						<p transition:fade={{ duration: disableTransitions ? 0 : 100 }}>
							{title}
						</p>
					{/if}
				{/if}
			</div>
		{:else}
			<div class="bookmark" in:scale|once={{ duration: 200 + 50 * i }}>
				<BookmarkArt
					--foreground={foreground}
					--background={background}
					--size="{$settings.ranges.iconSize.value + 5}px"
					{title}
				/>
			</div>
		{/if}
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
	}

	.bookmark {
		display: flex;
		position: relative;
		align-items: center;
		flex-direction: column;
		justify-content: flex-end;

		width: var(--size, 100%);
		height: var(--size, 100%);
		margin: auto;

		border-radius: 10px;

		text-align: center;
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
	}

	a.dragging {
		pointer-events: none;
		cursor: inherit;
	}

	img {
		position: absolute;
		inset: 0;
	}
</style>
