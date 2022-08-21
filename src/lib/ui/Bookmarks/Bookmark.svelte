<script lang="ts">
	import type { Bookmark } from '$lib/data/types'

	import { settings } from '$lib/stores'
	import { activeBookmarks } from '$lib/data/dbStore'

	import BookmarkArt from './BookmarkArt.svelte'

	import { editor } from '$lib/stores/bookmarkEditor'
	import { scale, fade } from 'svelte/transition'
	import { debounce } from '$lib/utils/debounce'
	import { onMount } from 'svelte'
	import { log } from 'fractils'

	export let i: number
	export let hovering: number
	export let dragging = false
	export let bookmark: Bookmark
	export let disableTransitions = false

	$: disableTransitions // is this necessary?
	$: url = bookmark?.url
	// $: basename = bookmark?.url?.replace('www.', '')?.split('://')[1]?.split('.')[0]

	let iconError = false // toggled if img tag request returns an error
	// $: icon_found = basename.split('.')?.[0]
	// $: icon = icon_found ? `https://cdn.cdnlogo.com/logos/a/1/${icon_found}.svg` : ''
	// $: image = bookmark?.autoImage && !iconError ? icon : bookmark?.image
	$: image = bookmark?.autoImage ? bookmark?.autoImageSrc : bookmark?.image
	let giving_up = false // When all auto-image attempts fail

	// $: if (!giving_up && iconError) {
	// 	fetchMeta(url).then((meta) => {

	// 	})
	// }

	const handleError = (e: Event) => {
		log('error loading image: ')
		log(e)
		iconError = true
	}

	$: title = bookmark?.title
	$: background = bookmark?.background ?? ''
	$: foreground = bookmark?.foreground

	let aspectRatio = '1'

	// Get the aspect ratio of the image if it exists
	onMount(async () => {
		if (image) {
			const img = new Image()
			img.addEventListener('load', () => {
				const width = img.naturalWidth
				const height = img.naturalHeight
				if (!isNaN(width) && !isNaN(height)) {
					aspectRatio = `${width} / ${height}`
				}
			})
			img.src = image
		}
	})

	$: bg = bookmark?.autoImage ? bookmark?.autoImageSrc : bookmark?.useImage ? bookmark?.image : bookmark?.background

	$: bgCss = bookmark?.useImage ? `background-image: url(${bg});` : `background: ${bg};`
</script>

<div class="bookmark-container" style={bookmark?.autoImage ? 'overflow: visible;' : ''}>
	<a
		class="item-{i} grid-item"
		href={url}
		class:dragging
		target="_blank"
		draggable="false"
		on:contextmenu|stopPropagation|preventDefault={() => editor.show(['edit', 'bookmark'], i)}
	>
		{#if image}
			<div
				in:scale={{ duration: disableTransitions ? 0 : 200 + 50 * i }}
				class="bookmark"
				style="
				height: {$settings.ranges.iconSize.value}px;
				color: {$settings.transparent ? 'transparent' : foreground};
				{bgCss}
				background-size: {bookmark?.autoImage ? 'cover' : 'contain'};
				"
				on:mouseover={() => debounce(() => ($settings.showTitle = true), 1500)}
				on:focus={() => debounce(() => ($settings.showTitle = false))}
			>
				<!-- <img
					style:aspect-ratio={aspectRatio}
					class="icon icon{i}"
					draggable="false"
					src={image}
					alt={title}
					on:mouseover={() => debounce(() => ($settings.showTitle = true), 1500)}
					on:focus={() => debounce(() => ($settings.showTitle = false))}
					on:error={handleError}
				/> -->
				{#if $settings.showTitle || hovering == i}
					{#if title && !dragging}
						<p transition:fade={{ duration: disableTransitions ? 0 : 100 }}>
							{title}
						</p>
					{/if}
				{/if}
			</div>
		{:else}
			<!-- <div class="bookmark" in:scale|once={{ duration: 200 + 50 * i }}>
				<BookmarkArt
					--foreground={foreground}
					--background={`url(${bookmark?.autoImageSrc})` || background}
					--size="{$settings.ranges.iconSize.value + 5}px"
				/>
			</div> -->
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

		pointer-events: none;
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

		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;

		border-radius: 10px;

		text-align: center;

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

	img {
		position: absolute;
		inset: 0;

		max-width: 100%;
		max-height: 100%;

		pointer-events: none;
	}
</style>
