<script lang="ts">
	import type { Folder } from '$lib/data/types'

	import db from '$lib/data/db'
	import { onMount } from 'svelte'

	let folderIcons = []
	let folders: [Folder['title'], Folder['icon']][] = []

	const getFolders = async () => {
		const allFolders = await db.folders.toArray()
		folders = allFolders.map((f) => [f.icon, f.title])
	}

	onMount(() => {
		getFolders()
	})
</script>

<template lang="pug">
	
	.folder-sidebar
		+if ('folders')
			+each('folders as [icon, title]')
				.folder-icon {icon}
				.folder-title {title}

</template>

<style>
	.folder-sidebar {
		position: absolute;

		border: 1px solid pink;
	}
</style>
