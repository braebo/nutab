<!-- TODO: Add panel for filtering by group -->
<script lang="ts">
	import { fly } from 'svelte/transition'
	import { emojis } from './emojis'
	import { onMount } from 'svelte'

	interface Props {
		showEmojiPicker: boolean
		emoji: string
		autofocus?: boolean
	}

	let { showEmojiPicker = $bindable(), emoji = $bindable(), autofocus = false }: Props = $props()

	// let emojiCount: number
	let search = $state('')
	let searchBar = $state<HTMLInputElement>()

	const handleClick = (char: string) => {
		emoji = char
		showEmojiPicker = false
	}

	onMount(() => {
		if (autofocus) searchBar?.focus()
	})
</script>

<div class="container" transition:fly|local={{ y: -10, duration: 250 }}>
	<div class="emoji-picker scroller">
		<input
			bind:this={searchBar}
			type="text"
			class="search"
			bind:value={search}
			placeholder="Search"
		/>

		<div class="emojis">
			{#each emojis as e, i}
				{#if !search || e.name.includes(search)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						class="emoji"
						onclick={() => handleClick(e.char)}
						role="button"
						tabindex="0"
					>
						{e.char}
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	.container {
		overflow: hidden;

		background-color: color-mix(in srgb, var(--fg-a) 90%, transparent);
		backdrop-filter: blur(5px);
		border-radius: var(--radius-md, 10px);

		margin-top: -2px;
	}
	.emoji-picker {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-items: top;
		gap: 5px;

		width: var(--width, 300px);
		max-width: 100%;
		height: var(--height, 600px);
		max-height: 600px;
		margin: var(--margin, auto);
		padding: 1rem;

		overflow-y: auto;
		overflow-x: hidden;
	}

	.emojis {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		gap: 5px;
		position: absolute;
		top: 4.5rem;

		width: 80%;

		padding: 1rem;
		padding-top: 0rem;
		margin-bottom: auto;
	}

	.emoji {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		height: 36px;
		width: 38px;
		padding-top: 2px;

		border-radius: 100px;

		font-size: 1.75rem;

		cursor: pointer;
		transition: 0.2s;
	}
	.emoji:hover,
	.emoji:focus {
		background: var(--fg-d);
	}
	.emoji:active {
		/* 		transform: scale(2); */
		background: var(--bg-d);
	}

	.search {
		position: sticky;
		top: 0rem;

		height: 40px;

		outline: none;
		border: none;
		color: var(--bg-b);
		background: color-mix(in srgb, var(--fg-a) 80%, transparent);
		backdrop-filter: blur(5px);
		border-radius: 20px;
		box-shadow:
			0px 3px 5px -3px rgba(0, 0, 0, 0.15),
			0px 4px 3px -1px rgba(0, 0, 0, 0.05),
			0px 14px 15px -1px rgba(0, 0, 0, 0.04);

		text-align: center;
		font-size: var(--font-size, 1.25rem);

		z-index: 2;
	}

	.search::placeholder {
		color: color-mix(in srgb, var(--bg-a) 25%, transparent);

		font-weight: 300;
	}

	.search:focus::placeholder {
		opacity: 0;
	}
</style>
