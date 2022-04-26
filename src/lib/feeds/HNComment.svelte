<script lang="ts">
	import CollapseIcon from '$lib/icons/CollapseIcon.svelte'
	import { formatDistanceToNow } from 'date-fns'
	import { fetchItem } from './fetchItem'

	export let commentId: number

	let hidden = false

	// function fixMissingPTag(text: string) {
	// 	const missing = text.split('<p>')
	// 	const fix = `<p>${missing[0]}</p>`
	// 	missing.shift()
	// 	return fix + missing
	// }
</script>

{#await fetchItem(commentId)}
	...
{:then comment}
	<article class="comment" class:hidden>
		<div class="meta-bar" on:click={() => (hidden = !hidden)}>
			<span class="meta">
				<a sveltekit:prefetch href="/user/{comment.by}">{comment.by}</a>
				<span class="time">
					· {formatDistanceToNow(comment.time * 1000)
						.replace(/\sminutes|minute/, 'm')
						.replace('about', '')
						.replace(/\s(hour|hours)/, 'hr')}
				</span>
			</span>
			<CollapseIcon bind:hidden />
		</div>

		<p class="body">
			<!-- {@html fixMissingPTag(comment.text)} -->
			{@html comment.text}
		</p>

		{#if comment.kids?.length > 0}
			<ul class="children">
				{#each comment.kids as child}
					<li><svelte:self commentId={child} /></li>
				{/each}
			</ul>
		{/if}
	</article>
{/await}

<style lang="scss">
	.comment {
		border-top: 2px solid rgba(var(--dark-d-rgb), 0.05);
		color: var(--dark-b);
		margin: 1rem 0;
	}

	// :global(html.dark) .comment {
	// 	border-top: 1px solid rgba(255, 255, 255, 0.1);
	// }
	.meta-bar {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 1rem;
		cursor: pointer;
		transition: background 0.25s;
		border-radius: 0.25rem;
		&:hover {
			background: rgba(var(--light-d-rgb), 0.15);
		}
	}

	.time {
		color: var(--light-d);
	}

	.comment .children {
		padding-left: 0.5rem;
		margin: 0;
		transition: 2s;
	}

	.hidden {
		& .body {
			max-height: 0px;
			overflow: hidden;
		}
		& .children {
			display: none;
		}
	}

	.body {
		font-size: 1rem;
		padding: 0 1rem;

		&,
		:global(*) {
			color: var(--dark-b);
		}
		& :global(p) {
			margin: 0.5rem 0;
		}
	}

	@media (min-width: 720px) {
		.comment .children {
			padding-left: 1.5rem;
		}
	}

	li {
		list-style: none;
	}

	.meta {
		display: block;
		font-size: 14px;
	}

	a {
		color: var(--light-d);
	}

	/* prevent crazy overflow layout bug on mobile */
	.body :global(*) {
		overflow-wrap: break-word;
		font-size: 1rem;
	}

	.comment :global(pre) {
		overflow-x: auto;
	}
</style>
