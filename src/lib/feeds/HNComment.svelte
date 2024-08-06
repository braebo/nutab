<script lang="ts">
	import type { IHNItem } from './types'

	import CollapseIcon from '$lib/graphics/icons/CollapseIcon.svelte'
	import LoadingDots from '$lib/graphics/LoadingDots.svelte'
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
				<div class="collapse-icon">
					<CollapseIcon bind:hidden />
				</div>
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

	.comment
		color: var(--dark-b)
		margin: 1rem 0

	li
		list-style: none
		position: relative

	.meta-bar
		position: relative

		padding: 0.5rem 1rem

		border-radius: 0.25rem
		
		font-family: var(--font-mono)
		
		transition: background 0.25s
		cursor: pointer
		
		&:hover
			background: rgba(var(--light-d-rgb), 0.15)
			& .collapse-icon
				opacity: 1

	.collapse-icon
		left: 0
		top: 0
		bottom: 0
		padding-left: 0.5rem
		
		transition: opacity 0.25s
		opacity: 0

	.time
		color: var(--light-d)


	.comment .children
		padding-left: 0.5rem
		margin: 0
		transition: 2s


	.hidden
		& .body
			display: none
		& .collapse-icon
			opacity: 1 !important

		& .children
			display: none


	.body
		padding: 1rem
		background: rgba(var(--light-a-rgb), 0.5)
		border-radius: var(--radius)

		font-size: 1.1rem
		font-weight: 200
		word-spacing: 1px
		letter-spacing: 0.2px
		box-shadow: var(--shadow-sm)

		/* prevent crazy overflow layout bug on mobile */
		overflow-wrap: break-word

		& :global(*)
			font-weight: 200
			color: var(--dark-b)

		& :global(i)
			opacity: 0.75

		& :global(p)
			margin: 0.5rem 0
			font-size: inherit
			font-weight: inherit


	@media (min-width: 720px)
		.comment .children
			padding-left: 1.5rem



	.meta
		display: flex
		gap: 0.5rem
		transform: translateX(-1rem)
		font-size: 14px


	a
		color: var(--light-d)


	.comment :global(pre)
		overflow-x: auto
		font-family: 'Inconsolata', monospace
		font-size: 1rem


	.dead,
	.deleted
		opacity: 0.3

		& *
			// font-family: var(--font-mono)
			font-family: 'Inconsolata', monospace
			letter-spacing: -0.5px
			font-size: 0.5rem

</style>
