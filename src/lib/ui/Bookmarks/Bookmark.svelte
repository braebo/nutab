<script lang="ts">
	// import type { Bookmark } from '../data/types';

	import { settings } from '$lib/settings/settingsStore'
	import { scale, fade } from 'svelte/transition'
	import type { Bookmark } from '$lib/data/types'
	import { createEventDispatcher } from 'svelte'
	import Edit from '$lib/icons/Edit.svelte'
	import BookmarkArt from './BookmarkArt.svelte'

	export let i: number
	export let hovering: number
	export let dragging = false
	export let bookmark: Bookmark
	const { url, tags, title, image, background, foreground, description } = bookmark

	const dispatch = createEventDispatcher()

	let timer: NodeJS.Timeout,
		showEditIcon = false,
		expandEditIcon = false

	function smoothOver(fn: Function, delay = 500) {
		if (dragging) return
		timer && clearTimeout(timer)
		timer = setTimeout(() => {
			fn()
		}, delay)
	}

	function smoothOut(fn: Function, delay = 300) {
		timer && clearTimeout(timer)
		timer = setTimeout(() => {
			fn()
		}, delay)
	}

	function handleClick(e: MouseEvent) {
		if (dragging) e.preventDefault()
	}
</script>

<div
	class="bookmark-container"
	on:mouseover={() => smoothOver(() => (showEditIcon = true))}
	on:focus={() => (showEditIcon = true)}
	on:mouseout={() => smoothOut(() => (showEditIcon = false))}
	on:blur={() => (showEditIcon = false)}
>
	{#if showEditIcon && !dragging}
		<div
			on:mouseover={() => smoothOver(() => (expandEditIcon = true))}
			on:focus={() => (expandEditIcon = true)}
			on:mouseout={() => smoothOut(() => (expandEditIcon = false))}
			on:blur={() => (expandEditIcon = false)}
			class="edit"
			class:expand={expandEditIcon}
			transition:scale={{ duration: 150 }}
			on:click|preventDefault={() => dispatch('showEditor', { bookmark, index: i })}
		>
			<Edit />
		</div>
	{/if}

	<a
		target="_blank"
		href={url}
		draggable="false"
		on:click|preventDefault={handleClick}
		class:dragging
	>
		{#if image}
			<div
				transition:scale={{ duration: 200 + 50 * i }}
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
					<p transition:fade={{ duration: 100 }}>{title}</p>
				{/if}
			</div>
		{:else}
			<div class="bookmark" transition:scale={{ duration: 200 + 50 * i }}>
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

		height: 100%;
		width: 100%;
	}
	.bookmark {
		display: flex;
		position: relative;
		align-items: center;
		flex-direction: column;
		justify-content: flex-end;

		width: 100%;
		height: 100%;
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

	.edit {
		position: absolute;
		top: -10px;
		right: -10px;

		width: max-content;
		width: 2rem;
		height: max-content;

		border-radius: 5px;

		font-size: 2rem;
		line-height: 0.2rem;

		cursor: pointer;
		transition: 0.2s;
		transform: scale(1);
		z-index: 5;
	}
	.edit:hover {
		transform: scale(1.1);
	}
</style>
