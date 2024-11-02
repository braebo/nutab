<script lang="ts">
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import { deleteBookmark_db } from '$lib/data/transactions.svelte'
	import TrashIcon from '$lib/data/icons/TrashIcon.svelte'
	import { grid } from '$lib/stores/grid.svelte'
	import { createEventDispatcher } from 'svelte'
	import Tooltip from '$lib/ui/Tooltip.svelte'

	const dispatch = createEventDispatcher()

	interface Props {
		bookmark_id: string
	}

	let { bookmark_id }: Props = $props()

	function _delete() {
		deleteBookmark_db(bookmark_id)
		dispatch('close')
		grid.reRender()
	}
</script>

{#if bookmarkEditor.bookmarkEditorContext == 'edit'}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div role="button" tabindex="0" class="delete" onclick={_delete}>
		<Tooltip content="Delete" offset={[0, 10]} placement="top">
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
</style>
