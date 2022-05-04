<script lang="ts">
	import { formatDistanceToNow } from 'date-fns'
	import { fly } from 'svelte/transition'

	import HNComment from './HNComment.svelte'
	import { fetchItem } from './fetchItem'

	export let threadId: number
</script>

<!-- <div class="thread"> -->
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
			<div class="content">
				{@html item.text}
			</div>
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

<!-- </div> -->
<style lang="scss">
	// .thread {
	// display: flex;
	// flex-direction: column;
	// gap: 0.5rem;
	// align-items: center;
	// justify-content: flex-start;
	// max-width: 100%;
	// max-width: 40%;
	// padding: 1rem;
	// box-sizing: border-box;
	// margin: 0;
	// border: 1px solid transparent;
	// transition: border 0.25s;

	// &:hover {
	// 	border-radius: var(--radius);
	// 	border: 1px solid rgba(var(--dark-a-rgb), 0.05);
	// }
	// }

	.item {
		border-bottom: 0.5rem solid rgba(var(--light-d-rgb), 0.25);
		padding-bottom: 1rem;
		border-radius: 1.5rem;
		background: rgba(var(--light-d-rgb), 0.05);
		padding: 1rem;
	}

	.item :global(*) {
		font-size: 1rem;
	}

	h1 {
		font-weight: 500;
		font-size: 2rem;
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
		margin: 0 0 1rem 2rem;
	}

	.content {
		color: var(--dark-a);
		background: rgba(var(--light-a-rgb), 0.2);
		padding: 1rem;
		border-radius: var(--radius-sm);
	}

	.dot {
		color: var(--light-d);
	}
</style>
