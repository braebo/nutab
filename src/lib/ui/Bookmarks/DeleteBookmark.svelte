<script lang="ts">
	import { editorContext } from '$lib/stores/bookmarkEditor'
	import { deleteBookmark_db } from '$lib/data/transactions'
	import TrashIcon from '$lib/data/icons/TrashIcon.svelte'
	import { reRender } from '$lib/stores/gridStore'
	import { createEventDispatcher } from 'svelte'
	import Tooltip from '$lib/ui/Tooltip.svelte'

	const dispatch = createEventDispatcher()

	export let bookmark_id: string

	function _delete() {
		deleteBookmark_db(bookmark_id)
		dispatch('close')
		$reRender = !$reRender
	}
</script>

{#if $editorContext == 'edit'}
	<div class="delete" on:click={_delete}>
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
