<script lang="ts">
	import FolderSidebar from '$lib/ui/Folders/FolderSidebar.svelte'
	import { activeSection } from '$lib/stores/activeSection.svelte'
	import { visibility } from '$lib/utils/visibility'
	import { onMount, type Snippet } from 'svelte'
	import News from '$lib/feeds/News.svelte'

	let main: HTMLElement
	let bookmarks: HTMLDivElement

	let { children }: { children?: Snippet } = $props()

	onMount(() => {
		main.scrollTo(0, bookmarks.offsetTop)
	})

	let newsVisible = $state(false)

	function handleChange(e: CustomEvent) {
		if (!newsVisible) newsVisible = e.detail.isVisible
		activeSection.value = e.detail.isVisible ? 'news' : 'bookmarks'
	}
</script>

<main bind:this={main}>
	<div class="col">
		<div
			class="news"
			use:visibility={{ threshold: 0.05, margin: '20px' }}
			onv-change={handleChange}
		>
			{#if newsVisible}
				<News />
			{/if}
		</div>

		<div class="bookmarks" bind:this={bookmarks}>
			{@render children?.()}
			<FolderSidebar />
		</div>
	</div>
</main>

<style lang="scss">
	main {
		min-height: 100vh;
		overflow-x: hidden;
		overflow-y: auto;
		scroll-snap-type: y mandatory;

		// Firefox
		scrollbar-width: none;

		// Chrome
		&::-webkit-scrollbar {
			display: none;
		}
	}

	.col {
		min-height: 200vh;
	}

	.news {
		display: flex;
	}

	.bookmarks,
	.news {
		scroll-snap-align: start;
		contain: content;
		min-height: 100vh;
		min-width: 100vw;
	}
</style>
