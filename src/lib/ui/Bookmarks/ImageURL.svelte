<script lang="ts">
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import { slide } from 'svelte/transition'

	let img = $derived(bookmarkEditor.editor?.image || '')

	let {
		open = false,
	}: {
		open?: boolean
	} = $props()

	const handleChange = (e: Event) => {
		if (bookmarkEditor.editor) {
			bookmarkEditor.editor.image = (e.target as HTMLInputElement).value
		}
	}
</script>

{#if open}
	<input
		type="text"
		value={img}
		oninput={handleChange}
		placeholder="Paste a custom image url here"
		transition:slide
	/>
{/if}

<style lang="scss">
	input {
		padding: 0.25rem;
		width: 400px;
		font-size: 10px;

		background: var(--fg-a);
		color: var(--bg-d);
		border-radius: var(--radius-sm);
		border: 1px solid var(--fg-b);
		outline: none;

		&:focus {
			&::placeholder {
				opacity: 0;
			}
		}
	}
</style>
