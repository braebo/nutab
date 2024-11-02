<script lang="ts">
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import TrashIcon from '$lib/data/icons/TrashIcon.svelte'
	import Tooltip from '$lib/ui/Tooltip.svelte'

	let {
		disabled = true,
		onclose = () => {},
		onclick = () => {},
	}: {
		disabled?: boolean
		onclose?: () => void
		onclick?: () => void
	} = $props()
</script>

{#if bookmarkEditor.bookmarkEditorContext == 'edit'}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div role="button" tabindex="0" class="delete" {onclick} class:disabled>
		<Tooltip
			content={disabled ? `Unable_to_delete_your_only_Folder` : 'Delete'}
			offset={[0, 10]}
			placement="top"
		>
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
