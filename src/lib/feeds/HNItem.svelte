<script lang="ts">
	import type { IHNItem } from './types'

	import CommentIcon from '$lib/graphics/icons/CommentIcon.svelte'
	// import RandomWave from '$lib/graphics/RandomWave.svelte'

	import { createEventDispatcher } from 'svelte'
	// import { daysAgo } from '$lib/utils/daysAgo'
	import { randomColor } from '$lib/utils'
	import { fade } from 'svelte/transition'

	interface Props {
		item: IHNItem
		activeThread: IHNItem['id'] | null
	}

	let { item, activeThread = $bindable(null) }: Props = $props()

	const dispatch = createEventDispatcher()
	const showThread = () => {
		dispatch('showThread', { id: activeThread === null ? item.id : null })
		activeThread = item.id
	}

	const background = `linear-gradient(to right, ${randomColor()}, ${randomColor()})`
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article class="article" onclick={showThread} class:active={activeThread === item.id}>
	<div class="image-container">
		{#if item.meta?.image}
			<div class="image" style="background-image: url({item.meta.image})" in:fade></div>
		{:else}
			<div class="random-thumbnail">
				<div class="image" style:background></div>
				<!-- <div class="random-wave">
					<RandomWave />
				</div> -->
			</div>
		{/if}
	</div>

	<div class="content col">
		<div class="row header">
			<div class="col">
				<a
					class="article-link"
					href={item.url ? item.url : ``}
					target="_blank"
					rel="noreferrer"
				>
					<h2>{item.title}</h2>
				</a>

				<div class="row info">
					<div class="since">{item.days_ago}</div>
					<span class="dot">·</span>
					<a
						class="author"
						target="_blank"
						href="https://news.ycombinator.com/user?id={item.by}"
						rel="noreferrer">{item.by}</a
					>
				</div>
			</div>
		</div>

		<div class="row">
			<p class="description">{item.meta?.description || ''}</p>
		</div>
	</div>

	<div class="comments">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="comment-count" onclick={showThread}>
			{item.kids ? item.kids.length : 0}
		</div>
		<div class="comment-icon">
			<CommentIcon />
		</div>
	</div>
</article>

<style lang="scss">
	.article {
		display: flex;
		position: relative;
		box-sizing: border-box;
		align-items: space-between;
		gap: 1.5rem;

		max-width: min(800px, 90vw);
		min-height: 112px;
		padding: 0.75rem;
		margin: 0.75rem 10%;

		background: var(--fg-a);
		border-radius: var(--radius);
		border: 1px solid transparent;
		box-shadow:
			0px 0.9px 0.7px rgba(0, 0, 0, 0.008),
			0px 2.1px 1.8px rgba(0, 0, 0, 0.012),
			0px 3.9px 3.4px rgba(0, 0, 0, 0.015),
			0px 6.9px 6px rgba(0, 0, 0, 0.018),
			0px 13px 11.3px rgba(0, 0, 0, 0.022),
			0px 31px 27px rgba(0, 0, 0, 0.03);

		transition:
			transform 0.2s,
			box-shadow 0.2s;

		cursor: pointer;
		backface-visibility: hidden;

		&.active {
			border: 1px solid var(--bg-d);
		}

		&:hover,
		&.active {
			transform: scale(1.025);
			box-shadow:
				0px 1.8px 0.7px rgba(0, 0, 0, 0.006),
				0px 4.3px 1.8px rgba(0, 0, 0, 0.008),
				0px 8.1px 3.4px rgba(0, 0, 0, 0.01),
				0px 14.5px 6px rgba(0, 0, 0, 0.012),
				0px 27.2px 11.3px rgba(0, 0, 0, 0.014),
				0px 65px 27px rgba(0, 0, 0, 0.02);

			.random-thumbnail,
			.image {
				filter: grayscale(0%);
			}
		}
	}

	.header {
		margin-bottom: 0.5rem;
		padding-right: 1rem;
	}

	h2 {
		width: max-content;
		max-width: min(100%, 60vw);

		color: var(--bg-a);

		font-variation-settings: 'wght' 500;
		font-family: var(--font-a);
		font-size: 1rem;
		word-spacing: 0px;
		line-height: 1.5rem;
		letter-spacing: 0.5px;

		transition: 0.25s;
	}

	a {
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
		&.article-link {
			text-decoration: none;
		}
	}

	.info {
		margin: 0;

		color: var(--bg-d);

		font-size: 0.8em;
		font-weight: 300;
	}

	.col {
		display: flex;
		flex-direction: column;
		flex-grow: 1;

		width: 100%;
		height: 100%;
	}

	.row {
		display: flex;
		width: 100%;
	}

	.content {
		width: 75%;
	}

	.article-link {
		text-decoration: none;
	}

	.description {
		width: 90%;
		max-width: min(550px, 90%);
		height: 1.2rem;

		color: var(--bg-d);

		font-weight: 400;
		font-family: var(--font-a);
		font-size: 0.9rem;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;

		opacity: 0.9;
		transition: opacity 0.2s;

		&:hover {
			opacity: 1;
		}
	}

	.comments {
		display: flex;
		align-items: center;
		gap: 0.25rem;

		position: absolute;
		right: 0.5rem;
		bottom: 0.5rem;

		color: var(--fg-d);

		font-family: var(--font-mono);
		font-size: 0.8rem;

		&:hover .comment-icon {
			transform: scale(1.2);
		}
	}

	.comment-icon {
		width: 22px;
		height: 22px;
		margin-right: 0.25rem;

		transition: transform 0.2s ease-out;
	}

	.image-container {
		min-width: 125px;
		min-height: 100px;
		max-width: 125px;
		max-height: 100px;
	}

	.random-thumbnail {
		position: relative;

		min-width: 125px;
		min-height: 100px;

		filter: grayscale(0%);
		transition: filter 0.3s;
	}

	.image {
		min-width: 125px;
		min-height: 100px;

		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: var(--radius-sm);

		transition: filter 0.3s;
		filter: grayscale(75%);
	}

	.author,
	.since {
		flex-wrap: nowrap;

		width: max-content;

		color: var(--fg-d);

		word-wrap: none;
		word-spacing: -1px;
		white-space: nowrap;
	}

	.dot {
		margin: 0 0.25rem;
	}
</style>
