<script lang="ts">
	import type { IHNItem } from './types'

	import LoadingDots from '$lib/graphics/LoadingDots.svelte'
	import CollapseIcon from '$lib/icons/CollapseIcon.svelte'
	import { formatDistanceToNow } from 'date-fns'
	import { fly } from 'svelte/transition'
	import { fetchItem } from './fetchData'

	export let commentId: number

	let hidden = false
	let dead = false
	let deleted = false

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
		<div class="meta-bar" on:click={() => (hidden = !hidden)}>
			<span class="meta">
				<a href="/user/{comment.by}" target="_blank">
					{pulseCheck(comment, comment.by)}
				</a>
				<span class="time">
					<!-- this is wack but I'm tired -->
					· {formatDistanceToNow(comment.time * 1000)
						.replace(/\sminutes|\sminute/, 'm')
						.replace('about', '')
						.replace(/\shours|\shour/, 'h')
						.replace('less than am', 'just now')}
				</span>
			</span>
			<CollapseIcon bind:hidden />
		</div>

		<p class="body" in:fly={{ y: 5 }}>
			{@html pulseCheck(comment, comment.text)}
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

<style lang="sass">
	@import url('https://fonts.googleapis.com/css2?family=Inconsolata&family=PT+Sans:wght@0,200&family=Red+Hat+Text&display=swap')

	$bg: rgba(var(--light-a-rgb), 0.5)

	.comment
		// border-top: 2px solid rgba(var(--dark-d-rgb), 0.05)
		color: var(--dark-b)
		margin: 1rem 0


	.meta-bar
		font-family: var(--font-mono)
		display: flex
		justify-content: space-between
		padding: 0.5rem 1rem
		cursor: pointer
		transition: background 0.25s
		border-radius: 0.25rem
		&:hover
			background: rgba(var(--light-d-rgb), 0.15)


	.time
		color: var(--light-d)


	.comment .children
		padding-left: 0.5rem
		margin: 0
		transition: 2s


	.hidden
		& .body
			display: none

		& .children
			display: none


	.body
		padding: 1rem
		background: $bg
		border-radius: var(--radius)

		// font-family: var(--brand-c)
		font-family: 'Red Hat Text', sans-serif
		font-family: 'PT Sans', serif
		font-size: 1.1rem
		font-weight: 200
		word-spacing: 1px
		letter-spacing: 0.2px
		box-shadow: var(--shadow-sm)

		/* prevent crazy overflow layout bug on mobile */
		overflow-wrap: break-word

		& :global(*)
			font-family: 'Red Hat Text', sans-serif
			font-family: 'PT Sans', serif
			font-weight: 200
			// font-weight: 100 !important
			// font-variation-settings: 'wght' 100 !important
			color: var(--dark-b)

		& :global(i)
			opacity: 0.75

		& :global(p)
			margin: 0.5rem 0
			font-size: inherit
			font-weight: inherit

		// font-family: 'Red Hat Text', sans-serif


	@media (min-width: 720px)
		.comment .children
			padding-left: 1.5rem


	li
		list-style: none


	.meta
		display: block
		font-size: 14px


	a
		color: var(--light-d)


	.comment :global(pre)
		overflow-x: auto


	.dead,
	.deleted
		opacity: 0.3

		& *
			// font-family: var(--font-mono)
			font-family: 'Inconsolata', monospace
			letter-spacing: -0.5px
			font-size: 0.75rem


</style>
