<script lang="ts">
	import type { Bookmark } from '$lib/data/types'

	import { settings } from '$lib/data/settings/settingsStore'
	import { scale, fade } from 'svelte/transition'

	import BookmarkArt from './BookmarkArt.svelte'

	export let i: number
	export let hovering: number
	export let dragging = false
	export let bookmark: Bookmark
	export let disableTransitions = false
	$: disableTransitions
	$: console.log(disableTransitions)
	const { url, title, image, background, foreground } = bookmark
</script>

<div class="bookmark-container">
	<a target="_blank" href={url} draggable="false" class:dragging style="pointer-events: none;">
		{#if image}
			<div
				transition:scale={{ duration: disableTransitions ? 0 : 200 + 50 * i }}
				class="bookmark"
				style="
				width: {$settings.ranges.iconSize.value}px;
				height: {$settings.ranges.iconSize.value}px;

				color: {$settings.transparent ? 'transparent' : foreground};
				background: {$settings.transparent ? 'transparent' : background};
				"
			>
				<img
					draggable="false"
					style="width: {$settings.ranges.iconSize.value}px;"
					class="icon icon{i}"
					src={image}
					alt={title}
				/>

				{#if (title && $settings.showTitle) || hovering == i}
					{#if !dragging}
						<p transition:fade={{ duration: disableTransitions ? 0 : 100 }}>{title}</p>
					{/if}
				{/if}
			</div>
		{:else}
			<div class="bookmark" transition:scale={{ duration: disableTransitions ? 0 : 200 + 50 * i }}>
				<BookmarkArt
					--foreground={foreground}
					--background={background}
					--size="{$settings.ranges.iconSize.value + 10}px"
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

		max-width: 100%;
		max-height: 100%;
		margin: auto;

		user-select: none;
	}

	p {
		position: absolute;

		width: fit-content;

		color: var(--dark-d);

		font-size: 18px;
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
</style>
