<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import { bookmarkEditorContext } from '$lib/stores/bookmarkEditor'
	import TrashIcon from '$lib/data/icons/TrashIcon.svelte'
	import Tooltip from '$lib/ui/Tooltip.svelte'

	interface Props {
		disabled?: boolean;
	}

	let { disabled = true }: Props = $props();
</script>

{#if $bookmarkEditorContext == 'edit'}
	<div class="delete" onclick={bubble('click')} class:disabled>
		<Tooltip content={disabled ? `Unable_to_delete_your_only_Folder` : 'Delete'} offset={[0, 10]} placement="top">
			<TrashIcon />
		</Tooltip>
	</div>
{/if}

<style>
	.delete {
		position: absolute;
		left: -6rem;
		bottom: 4px;
	}
	.disabled {
		opacity: 0.5;

		cursor: not-allowed;
	}
</style>
