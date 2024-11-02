<script lang="ts">
	import LoadingDots from '$lib/graphics/LoadingDots.svelte'
	import { formatDistanceToNow } from 'date-fns'
	import { fly } from 'svelte/transition'

	import HNComment from './HNComment.svelte'
	import { fetchItem } from './fetchData'

	interface Props {
		threadId: number
	}

	let { threadId }: Props = $props()

	let transitionDuration = 200
</script>

{#await fetchItem(threadId)}
	<LoadingDots />
{:then item}
	<article
		class="item"
		out:fly={{ y: -10, duration: transitionDuration }}
		in:fly={{ y: -10, delay: transitionDuration }}
	>
		<a class="main-link" href={item.url} target="_blank">
			<h1>{item.title}</h1>
		</a>

		<p class="meta">
			{item.score} points
			<span class="dot">·</span>
			<a href="https://news.ycombinator.com/user?id={item.by}">
				{item.by}
			</a>
			<span class="dot">·</span>
			{#if item.time}
				{formatDistanceToNow(item.time * 1000).replace('about', '')} ago
			{/if}
		</p>

		{#if item.text}
			<div class="content">{@html item.text}</div>
		{/if}
	</article>

	<div class="comments">
		{#if item.kids?.length}
			{#each item.kids as commentId}
				<HNComment {commentId} />
			{/each}
		{:else}
			<p>No comments yet...</p>
		{/if}
	</div>
{:catch e}
	Problem loading thread:
	<pre>{JSON.stringify(e)}</pre>
{/await}

<style lang="scss">
	// TODO #19 install Merriweather locally if it's going to be used
	// @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300');

	article.item {
		margin: 0 auto 2rem auto;
		padding: 1rem 2rem;

		border-radius: 1.5rem;
		border-bottom: 0.5rem solid color-mix(in srgb, var(--fg-d) 25%, transparent);
		background: color-mix(in srgb, var(--fg-a) 50%, transparent);
		box-shadow: 0 3px 0.75rem 0 #11111115;
	}

	.item :global(*) {
		font-size: 1rem;
	}

	h1 {
		font-weight: 300 !important;
		font-size: 1.75rem !important;
		font-family: var(--font-c);
	}

	:global(html.dark) .item {
		border-bottom: 0.5rem solid color-mix(in srgb, var(--fg-d) 25%, transparent);
	}

	.main-link {
		display: block;
		text-decoration: none;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		margin: 1rem auto 0 auto;

		opacity: 0.5;

		font-size: 0.85rem;
		font-weight: 300;
	}

	.content {
		padding: 1rem;
		color: var(--bg-a);
		background: color-mix(in srgb, var(--fg-a) 20%, transparent);
		border-radius: var(--radius-sm);
	}

	.comments {
		width: 100%;
	}
</style>
