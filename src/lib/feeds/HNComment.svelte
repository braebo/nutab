<script lang="ts">
	import HNComment from './HNComment.svelte'
	import type { IHNItem } from './types'

	import CollapseIcon from '$lib/graphics/icons/CollapseIcon.svelte'
	import LoadingDots from '$lib/graphics/LoadingDots.svelte'
	import { formatDistanceToNow } from 'date-fns'
	import { fly } from 'svelte/transition'
	import { fetchItem } from './fetchData'

	interface Props {
		commentId: number
	}

	let { commentId }: Props = $props()

	let hidden = $state(false)
	let dead = $state(false)
	let deleted = $state(false)

	const pulseCheck = (comment: IHNItem, _default: string) => {
		if (comment.dead) {
			dead = true
			return '[dead]'
		}
		if (comment.deleted) {
			deleted = true
			return '[deleted]'
		} else return _default
	}
</script>

{#await fetchItem(commentId)}
	<LoadingDots />
{:then comment}
	<article class="comment" class:hidden class:dead class:deleted>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div role="button" tabindex="0" class="meta-bar" onclick={() => (hidden = !hidden)}>
			<span class="meta">
				<div class="collapse-icon">
					<CollapseIcon bind:hidden />
				</div>
				{#if comment.by}
					<a href="/user/{comment.by}" target="_blank">
						{pulseCheck(comment, comment.by)}
					</a>
				{/if}
				{#if comment.time}
					<span class="time">
						<!-- this is wack but I'm tired -->
						· {formatDistanceToNow(comment.time * 1000)
							.replace(/\sminutes|\sminute/, 'm')
							.replace('about', '')
							.replace(/\shours|\shour/, 'h')
							.replace('less than am', 'just now')}
					</span>
				{/if}
			</span>
		</div>

		{#if comment.text}
			<p class="body" in:fly={{ y: 5 }}>
				{@html pulseCheck(comment, comment.text)}
			</p>
		{/if}

		{#if comment.kids}
			{#if comment.kids.length > 0}
				<ul class="children">
					{#each comment.kids as child}
						<li><HNComment commentId={child} /></li>
					{/each}
				</ul>
			{/if}
		{/if}
	</article>
{/await}

<style lang="scss">
	.comment {
		color: var(--bg-b);
		margin: 1rem 0;
	}

	li {
		list-style: none;
		position: relative;
	}

	.meta-bar {
		position: relative;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		font-family: var(--font-mono);
		transition: background 0.25s;
		cursor: pointer;

		&:hover {
			background: color-mix(in srgb, var(--fg-d) 15%, transparent);
			.collapse-icon {
				opacity: 1;
			}
		}
	}

	.collapse-icon {
		left: 0;
		top: 0;
		bottom: 0;
		padding-left: 0.5rem;
		transition: opacity 0.25s;
		opacity: 0;
	}

	.time {
		color: var(--fg-d);
	}

	.comment .children {
		padding-left: 0.5rem;
		margin: 0;
		transition: 2s;
	}

	.hidden {
		.body {
			display: none;
		}
		.collapse-icon {
			opacity: 1 !important;
		}
		.children {
			display: none;
		}
	}

	.body {
		padding: 1rem;
		background: color-mix(in srgb, var(--fg-a) 50%, transparent);
		border-radius: var(--radius);
		font-size: 1.1rem;
		font-weight: 200;
		word-spacing: 1px;
		letter-spacing: 0.2px;
		box-shadow: var(--shadow-sm);
		overflow-wrap: break-word;

		:global(*) {
			font-weight: 200;
			color: var(--bg-b);
		}

		:global(i) {
			opacity: 0.75;
		}

		:global(p) {
			margin: 0.5rem 0;
			font-size: inherit;
			font-weight: inherit;
		}
	}

	@media (min-width: 720px) {
		.comment .children {
			padding-left: 1.5rem;
		}
	}

	.meta {
		display: flex;
		gap: 0.5rem;
		transform: translateX(-1rem);
		font-size: 14px;
	}

	a {
		color: var(--fg-d);
	}

	.comment :global(pre) {
		overflow-x: auto;
		font-family: 'Inconsolata', monospace;
		font-size: 1rem;
	}

	.dead,
	.deleted {
		opacity: 0.3;

		* {
			font-family: 'Inconsolata', monospace;
			letter-spacing: -0.5px;
			font-size: 0.5rem;
		}
	}
</style>
