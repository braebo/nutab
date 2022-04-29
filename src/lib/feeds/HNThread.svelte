<script lang="ts">
	import { formatDistanceToNow } from 'date-fns'
	import { fly } from 'svelte/transition'

	import HNComment from './HNComment.svelte'
	import { fetchItem } from './fetchItem'

	export let threadId: number
</script>

<div class="thread">
	{#await fetchItem(threadId)}
		...
	{:then item}
		<article class="item" transition:fly={{ y: 10 }}>
			<a class="main-link" href={item.url}>
				<h1>{item.title}</h1>
			</a>

			<p class="meta">
				{item.score} points
				<span class="dot">·</span>
				<a href="https://news.ycombinator.com/user?id={item.by}">{item.by}</a>
				<span class="dot">·</span>
				{formatDistanceToNow(item.time * 1000).replace('about', '')} ago
			</p>

			{#if item.text}
				{@html item.text}
			{/if}
		</article>

		<div class="comments">
			{#if item.kids?.length > 0}
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
</div>

<style lang="scss">
	.thread {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		/* align-items: center; */
		justify-content: flex-start;
		width: 40%;
		min-width: 40%;
		height: 80%;
		padding: 1rem;
		box-sizing: border-box;
		margin: 0;
		border: 1px solid transparent;
		transition: border 0.25s;
	}
	.thread:hover {
		border-radius: var(--radius);
		border: 1px solid rgba(var(--dark-a-rgb), 0.05);
	}

	h1 {
		font-weight: 500;
		font-size: 2rem;
		margin-bottom: 2rem;
	}

	.item {
		border-bottom: 0.5rem solid rgba(var(--light-d-rgb), 0.25);
		padding-bottom: 1rem;
		border-radius: 1.5rem;
	}

	.item :global(*) {
		font-size: 1rem;
	}

	:global(html.dark) .item {
		border-bottom: 1em solid rgba(var(--light-d-rgb), 0.25);
	}

	.main-link {
		display: block;
		text-decoration: none;
	}

	.meta {
		font-size: 0.85rem;
		font-weight: 300;
		margin-left: 2rem;
	}

	.dot {
		color: var(--light-d);
	}

	.comments {
		overflow-y: auto;
	}
	.comments,
	:global(pre) {
		&::-webkit-scrollbar-track {
			background: transparent;
		}
	}
	.comments,
	:global(pre) {
		&::-webkit-scrollbar {
			width: 0.5rem;
			height: 0.5rem;
			background: transparent;
		}
	}
	.comments,
	:global(pre) {
		&::-webkit-scrollbar-thumb {
			background: rgba(var(--light-d-rgb), 0.5);
			border-radius: 5px;
		}
	}

	/* .comments > :global(.comment):first-child {
		border-top: none;
	} */
</style>
